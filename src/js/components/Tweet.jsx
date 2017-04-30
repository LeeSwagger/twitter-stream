/**
 * Tweet component
 */

/**
 * Renders the Tweet component
 *
 * @param {object} props - The props that are passed to this component
 * @return {string} - HTML markup for the component
 */
const Tweet = (props = {}) => {
    const {
        retweeted_status: {
            id_str,
            text,
            user: { screen_name, profile_image_url }
        }
    } = props;

    const tweetUrl = `https://twitter.com/${screen_name}/status/${id_str}`;

    return (
        <div className="tweet carousel-cell">
            <a href={tweetUrl} target="_blank" className="tweet-link">
                <span className="tweet-header">
                    <img
                        src={profile_image_url}
                        alt={screen_name}
                        className="author-avatar"
                    />
                    <span className="author-name">
                        {screen_name}
                    </span>
                </span>
                <span className="tweet-text">
                    {text}
                </span>
            </a>
        </div>
    );
};

export default Tweet;
