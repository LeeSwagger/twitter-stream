import { PropTypes, Component } from 'react';
import Tweet from './Tweet';
import Flickity from 'flickity';
import moment from 'moment';

/**
 * TweetGroup component
 */
export default class TweetGroup extends Component {
    /**
     * Initialize flickity slider and
     * save active tweet ID on 'settle' event
     */
    componentDidMount() {
        this.tweetsSlider = new Flickity(this.refs[this.props.groupName], {
            draggable: false,
            prevNextButtons: true,
            pageDots: false
        });

        this.tweetsSlider.on('settle', () => {
            const { actions, tweets, groupName } = this.props;

            const { selectedIndex } = this.tweetsSlider;

            actions.saveActiveTweetId(tweets[selectedIndex].id, groupName);
        });
    }

    /**
     * Deactivate slider if tweets count changed
     *
     * @param {object} nextProps
     */
    componentWillUpdate(nextProps) {
        const { tweets } = this.props;
        const { tweets: nextTweets } = nextProps;

        if (tweets.length !== nextTweets.length) {
            this.tweetsSlider.deactivate();
        }
    }

    /**
     * Activate slider if tweets count changed
     *
     * @param {object} prevProps
     */
    componentDidUpdate(prevProps) {
        const { tweets, activeTweetId } = this.props;
        const { tweets: prevTweets } = prevProps;

        if (tweets.length !== prevTweets.length) {
            this.tweetsSlider.activate();

            const activeTweetIndex = tweets.findIndex(
                tweet => tweet.id === activeTweetId
            );

            this.tweetsSlider.select(
                activeTweetIndex > 0 ? activeTweetIndex : 0,
                false,
                true
            );
        }
    }

    /**
     * Brings number in a specific format (e.g. 4.7 k, 1.2 M ...)
     *
     * @param {number} number
     */
    numberFormatter(number) {
        if (number > 999 && number < 999999) {
            return (number / 1000).toFixed(1).replace('.0', '') + ' k';
        } else if (number > 999999) {
            return (number / 1000000).toFixed(1).replace('.0', '') + ' M';
        }

        return number;
    }

    /**
     * Renders the TweetGroup component
     *
     * @return {string} - HTML markup for the component
     */
    render() {
        const { tweets, lastUpdateTime, groupName } = this.props;

        const lastUpdate = moment(lastUpdateTime);

        const [totalLikeCount, totalRetweetCount] = _.reduce(
            tweets,
            (total, tweet) => {
                const {
                    retweeted_status: { favorite_count, retweet_count }
                } = tweet;

                const [likesCount, retweetsCount] = total;

                return [
                    likesCount + favorite_count,
                    retweetsCount + retweet_count
                ];
            },
            [0, 0]
        );

        return (
            <div className="tweet-group">
                <time className="last-update">
                    <span className="date">
                        {lastUpdate.format('DD/MM/YYYY')}
                    </span>
                    <span className="time">
                        {lastUpdate.format('hh:mm')}
                    </span>
                </time>
                <div className="tweets-container">
                    <div className="tweets" ref={groupName}>
                        {_.map(tweets, (tweet, index) => (
                            <Tweet {...tweet} key={index} />
                        ))}
                    </div>
                </div>
                <div className="total">
                    <div className="measure">
                        <div className="icon icon-twitter" />
                        <div className="count">{tweets.length}</div>
                    </div>
                    <div className="measure">
                        <div className="icon icon-heart" />
                        <div className="count">
                            {this.numberFormatter(totalLikeCount)}
                        </div>
                    </div>
                    <div className="measure">
                        <div className="icon icon-retweet" />
                        <div className="count">
                            {this.numberFormatter(totalRetweetCount)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * @prop {Object} propTypes - The props that are passed to this component
 */
TweetGroup.propTypes = {
    range: PropTypes.array,
    tweets: PropTypes.array,
    capacity: PropTypes.number,
    lastUpdateTime: PropTypes.number.isRequired
};
