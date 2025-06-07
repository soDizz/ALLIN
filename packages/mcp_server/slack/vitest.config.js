export default {
  test: {
    // In test code, we use really call Slack API, so it takes time to complete.
    testTimeout: 20000,
  },
};
