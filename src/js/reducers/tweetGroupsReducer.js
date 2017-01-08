export default (state = {}, action) => {
	const { type, payload = {} } = action;
	const { groupName, updatedGroup, activeTweetId } = payload;

	switch (type) {
		case 'INIT_TWEET_GROUPS':
			return {
				...payload
			};
		case 'UPDATE_TWEET_GROUP':
			return {
				...state,
				[groupName]: updatedGroup
			};
		case 'SAVE_ACTIVE_TWEET_ID':
			return {
				...state,
				[groupName]: {
					...state[groupName],
					activeTweetId
				}
			};
		default:
			return state;
	}
};
