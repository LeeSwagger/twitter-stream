import { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as tweetGroupsActions from '../actions/tweetGroupsActions';
import TweetGroup from '../components/TweetGroup';
import SocketClient from 'socket.io-client';
import BinaryHeap from './../utils/BinaryHeap';

/**
 * Application component
 */
class Application extends Component {

    /**
     * constructor
     *
     * @param {object} props - The props that are passed to this component
     */
    constructor(props) {
        super(props);

        this.twitterSocket = new SocketClient('http://localhost:3000');
        this.receiveTweet = 'receive_tweet';

        this.handleTweet = tweet => {
            if (tweet.retweeted_status) {
                props.actions.receiveTweet(tweet);
            }
        };
    }

    /**
     * Initialize tweet groups; subscribe on tweets channel
     */
    componentDidMount() {
        this.props.actions.initTweetGroups();
        this.twitterSocket.on(this.receiveTweet, this.handleTweet);
    }

    /**
     * Renders the Application component.
     *
     * @return {string} - HTML markup for the component
     */
    render() {
        const {
            actions,
            tweetGroups
        } = this.props;

        const tweetGroupsHeap = new BinaryHeap(({ lastUpdateTime }) => lastUpdateTime);

        _.map(tweetGroups, tweetGroup => tweetGroupsHeap.push(tweetGroup));

        const sortedGroups = _.reverse(_.times(tweetGroupsHeap.size(), () => tweetGroupsHeap.pop()));

        return (
            <div className="container">
                <header className="header">
                    <h1 className="site-title">Twitter stream</h1>
                    <button
                        className="action-button"
                        onClick={() => {
                            this.twitterSocket.on(this.receiveTweet, this.handleTweet);
                        }}>
                        Subscribe
                    </button>
                    <button
                        className="action-button"
                        onClick={() => {
                            this.twitterSocket.removeListener(this.receiveTweet, this.handleTweet);
                        }}>
                        Unsubscribe
                    </button>
                </header>
                <div className="tweet-groups">
                    {_.map(sortedGroups, (tweetGroup, index) => (
                        <TweetGroup
                            key={index}
                            actions={actions}
                            {...tweetGroup}
                        />
                    ))}
                    <div className="icon-calendar"></div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ tweetGroups }) => ({
    tweetGroups
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(tweetGroupsActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Application);
