import {
  GITHUB_APP_NAME,
  GITHUB_APP_INSTALLATION_LINK,
  AUTO_CHANGESET_AND_RELEASE_NOTES_TOOL_NAME,
  AUTO_CHANGESET_AND_RELEASE_NOTES_TOOL_DOCS,
} from "../config/constants.js";

/**
 * Represents an error when the GitHub App is suspended or not installed in the repository.
 */
export class GitHubAppSuspendedOrNotInstalledError extends Error {
  /**
   * Constructs the GitHubAppSuspendedOrNotInstalledError instance.
   */
  constructor() {
    const message =
      `[${GITHUB_APP_NAME}](${GITHUB_APP_INSTALLATION_LINK}) is suspended or not installed in your forked repository. Please ensure the app is installed and has the necessary permissions.` +
      `\n\n` +
      `For more information, visit [${AUTO_CHANGESET_AND_RELEASE_NOTES_TOOL_NAME}](${AUTO_CHANGESET_AND_RELEASE_NOTES_TOOL_DOCS}).`;
    super(message);
    this.name = this.constructor.name;
    this.status = 403;

    /**
     * Indicates whether this error should trigger a comment in the pull request.
     * @type {boolean}
     */
    this.shouldResultInPRComment = true;
  }
}

/**
 * Represents an error when the CHANGELOG_PR_BRIDGE_URL_DOMAIN constant is not set.
 */
export class MissingChangelogPullRequestBridgeUrlDomainError extends Error {
  /**
   * Constructs the MissingChangelogPullRequestBridgeUrlDomainError instance.
   */
  constructor() {
    const message =
      `The CHANGELOG_PR_BRIDGE_URL_DOMAIN constant is not set. Please ensure that this URL is configured in your repository as a Github Secret.\n\n` +
      `For more information, visit [${AUTO_CHANGESET_AND_RELEASE_NOTES_TOOL_NAME}](${AUTO_CHANGESET_AND_RELEASE_NOTES_TOOL_DOCS}).`;
    super(message);
    this.name = this.constructor.name;
    /**
     * Indicates whether this error should trigger a comment in the pull request.
     * @type {boolean}
     */
    this.shouldResultInPRComment = true;
  }
}

/**
 * Represents an error when the CHANGELOG_PR_BRIDGE_API_KEY constant is not set.
 */
export class MissingChangelogPullRequestBridgeApiKeyError extends Error {
  /**
   * Constructs the MissingChangelogPullRequestBridgeApiKeyError instance.
   */
  constructor() {
    const message =
      `The CHANGELOG_PR_BRIDGE_API_KEY constant is not set. Please ensure that this key is configured in your repository as a Github Secret.\n\n` +
      `For more information, visit [${AUTO_CHANGESET_AND_RELEASE_NOTES_TOOL_NAME}](${AUTO_CHANGESET_AND_RELEASE_NOTES_TOOL_DOCS}).`;
    super(message);
    this.name = this.constructor.name;
    /**
     * Indicates whether this error should trigger a comment in the pull request.
     * @type {boolean}
     */
    this.shouldResultInPRComment = true;
  }
}

export class UnauthorizedRequestToPullRequestBridgeServiceError extends Error {
  /**
   * Constructs the UnauthorizedApiKeyError instance.
   */
  constructor() {
    const message =
      `Unauthorized request to **OpenSearch Changelog PR Bridge** service. Please ensure the correct API key is configured in your repository as a Github Secret.\n\n` +
      `For more information, visit [${AUTO_CHANGESET_AND_RELEASE_NOTES_TOOL_NAME}](${AUTO_CHANGESET_AND_RELEASE_NOTES_TOOL_DOCS}).`;
    super(message);
    this.name = this.constructor.name;
    this.status = 401;
    /**
     * Indicates whether this error should trigger a comment in the pull request.
     * @type {boolean}
     */
    this.shouldResultInPRComment = true;
  }
}
