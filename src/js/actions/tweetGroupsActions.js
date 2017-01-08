import BinaryHeap from './../utils/BinaryHeap';

/**
 * TweetGroups actions
 */

/**
 * Initializes the 5 tweetGroups with this ranges of tweet score:
 *
 * [0 - 100]
 * [100 - 500]
 * [500 - 1000]
 * [1000 - 2000]
 * [> 2000]
 *
 * @return {object} - An action object with a type of INIT_TWEET_GROUPS
 */
export function initTweetGroups() {
    return {
        type: 'INIT_TWEET_GROUPS',
        payload: [
            [0, 100],
            [100, 500],
            [500, 1000],
            [1000, 2000],
            [2000]
        ].reduce((previousGroups, range, index) => ({
            ...previousGroups,
            [`group_${index}`]: {
                range,
                tweets: [],
                capacity: 30,
                lastUpdateTime: 0,
                activeTweetId: 0,
                groupName: `group_${index}`
            }
        }), {})
    };
}

/**
 * Dispatched when the new tweet are received
 *
 * @param  {object} newTweet - The tweet data
 *
 * @return {object} - An action object with a type of UPDATE_TWEET_GROUP passing the tweet groups
 */
export function receiveTweet(newTweet) {
    return (dispatch, getState) => {
        const { tweetGroups } = getState();

        const {
            retweeted_status: {
                retweet_count,
                favorite_count
            }
        } = newTweet;

        const receivedTweet = {
            ...newTweet,
            score: retweet_count + favorite_count
        };

        _.map(tweetGroups, tweetGroup => {
            let { activeTweetId } = tweetGroup;

            const {
                range: [rangeStart = 0, rangeEnd = Infinity],
                tweets,
                capacity,
                groupName
            } = tweetGroup;

            if (receivedTweet.score < rangeStart || receivedTweet.score > rangeEnd) {
                return;
            }

            const duplicateTweetIndex = tweets.findIndex(tweet => {
                return tweet.retweeted_status.id === receivedTweet.retweeted_status.id;
            });

            const tweetAlreadyExists = duplicateTweetIndex > 0;

            if (tweetAlreadyExists) {
                const { retweeted_status, score } = receivedTweet;

                tweets[duplicateTweetIndex] = {
                    ...tweets[duplicateTweetIndex],
                    retweeted_status,
                    score
                };
            }

            const tweetsHeap = new BinaryHeap(tweet => tweet.score);

            _.forEach(tweets, tweet => tweetsHeap.push(tweet));

            if (tweets.length === capacity && !tweetAlreadyExists) {
                const lastTweet = tweetsHeap.pop();

                if (receivedTweet.score <= lastTweet.score) {
                    return;
                }

                activeTweetId = 0;
                tweetsHeap.push(receivedTweet);
            } else if (!tweetAlreadyExists) {
                tweetsHeap.push(receivedTweet);
            }

            dispatch({
                type: 'UPDATE_TWEET_GROUP',
                payload: {
                    groupName,
                    updatedGroup: {
                        ...tweetGroup,
                        tweets: _.reverse(_.times(tweetsHeap.size(), () => tweetsHeap.pop())),
                        lastUpdateTime: Date.now(),
                        activeTweetId
                    }
                }
            });
        });
    };
}

/**
 * Dispatched when the active tweet id changed
 *
 * @param {number} activeTweetId - The tweet ID
 * @param {string} groupName - The name of the group which contains this tweet
 *
 * @return {object} - An action object with a type of SAVE_ACTIVE_TWEET_ID passing the active tweet ID and group name
 */
export function saveActiveTweetId(activeTweetId, groupName) {
    return {
        type: 'SAVE_ACTIVE_TWEET_ID',
        payload: {
            groupName,
            activeTweetId
        }
    };
}
