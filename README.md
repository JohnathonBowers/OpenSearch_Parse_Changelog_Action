<a name="back-to-top"></a>

<!-- prettier-ignore-start -->
<!-- omit in toc -->
<h1> OpenSearch Automated Changelog Workflow and Release Notes Process</h1>
<!-- prettier-ignore-end -->

![Apache 2.0 License](https://img.shields.io/github/license/saltstack/salt)

<!-- ![Coverage Badge](./badges/coverage.svg) -->

<!-- prettier-ignore-start -->
<!-- omit in toc -->
<h2> Introduction </h2>
<!-- prettier-ignore-end -->

This repository contains the details and source code for the **Automated Changelog and Release Notes Process** adopted by the [OpenSearch Project](https://opensearch.org/) community. This automated process streamlines the release procedure for OpenSearch contributors and maintainers. Details about the automated process, along with instructions for configuring and using the process in OpenSearch repositories, are available below.

<!-- prettier-ignore-start -->
<!-- omit in toc -->
<h2> Table of Contents </h2>
<!-- prettier-ignore-end -->

- [1. Background of the Automated Process](#1-background-of-the-automated-process)
- [2. Benefits of the Automated Process](#2-benefits-of-the-automated-process)
- [3. A Word on Terminology](#3-a-word-on-terminology)
- [4. Process Overview](#4-process-overview)
  - [4.1. Changelog Workflow Process](#41-changelog-workflow-process)
    - [4.1.1. Changelog Process Entities](#411-changelog-process-entities)
    - [4.1.2. Changelog Process Jobs](#412-changelog-process-jobs)
  - [4.2. Release Notes Process](#42-release-notes-process)
    - [4.2.1 Update the Changelog Document](#421-update-the-changelog-document)
    - [4.2.2 Generate the Release Notes](#422-generate-the-release-notes)
- [5. Getting Started for OpenSearch Repository Maintainers](#5-getting-started-for-opensearch-repository-maintainers)
  - [5.1. Changelog Workflow Process](#51-changelog-workflow-process)
    - [5.1.1. Create a New `changelogs` Directory](#511-create-a-new-changelogs-directory)
    - [5.1.2. Add a "Changelog" Section to the PR Description Template](#512-add-a-changelog-section-to-the-pr-description-template)
    - [5.1.3. Add a Github Worflow File to Invoke the OpenSearch Changelog Action](#513-add-a-github-worflow-file-to-invoke-the-opensearch-changelog-action)
  - [5.2. Release Notes Process](#52-release-notes-process)
    - [5.2.1 Verify Core Modules and Install `js-yaml`](#521-verify-core-modules-and-install-js-yaml)
    - [5.2.2 Ensure Proper Location of Files and Directories](#522-ensure-proper-location-of-files-and-directories)
    - [5.2.3 Configure Files and Script Command](#523-configure-files-and-script-command)
- [6. Usage for OpenSearch Maintainers and Contributors](#6-usage-for-opensearch-maintainers-and-contributors)
  - [6.1. Changelog Workflow Process](#61-changelog-workflow-process)
    - [6.1.1. Automatic Approach](#611-automatic-approach)
    - [6.1.2. Manual Approach](#612-manual-approach)
  - [6.2. Release Notes Process](#62-release-notes-process)
- [7. Mantainers](#7-mantainers)
- [8. Contributing](#8-contributing)
- [9. License](#9-license)
- [10. Need Help?](#10-need-help)

<p align="right">(<a href="#back-to-top">back to top</a>)</p>

## 1. Background of the Automated Process

On March 20, 2023, Josh Romero issued a [call for proposals](https://github.com/opensearch-project/.github/issues/148) that would "solve the entire collection of issues around generating both ongoing changelogs and release notes during General Availability (GA) of the product, for all OpenSearch project repositories."

On May 4, 2023, a working group voted unanimously to move forward with the "Automation" variation of [Ashwin Chandran's proposal](https://github.com/opensearch-project/.github/issues/156). This proposal has now been implemented, and the details of the new changelog and release notes process are set out below.

<p align="right">(<a href="#back-to-top">back to top</a>)</p>

## 2. Benefits of the Automated Process

The **Automated Changelog and Release Notes Process** presented here improves both contributor experience as well as the efficiency of product development and the release of new versions for OpenSearch repositories.

Without the automated process, henever a contributor opens a new PR, they are prompted to indicate whether or not they have manually added an entry to the `CHANGELOG.md` file. However, since changelog entries require a PR number as a reference, contributors need to open a PR first, grab its number, and then add a second commit including the changelog entry.

This creates an inefficient two-step process, which also opens the door to potential merge conflicts. If two or more contributors update the `CHANGELOG.md` file in their respective PRs, and those updates are not synchronized with each other, the possibility of merge conflicts arises, which complicates the process of contributing. 

Likewise, when a new product version is scheduled for GA release, release notes and changelog updates have to be prepared manually. This process is both time consuming and labor intensive.

Automating the changelog and release notes process resolves these complications, giving valuable time back to contributors and maintainers and improving the overall experience of working in OpenSearch's repositories.

<p align="right">(<a href="#back-to-top">back to top</a>)</p>

## 3. A Word on Terminology

The **Automated Changelog and Release Notes Process** makes frequent reference to the concept of **changesets** and **fragment files**. In version control systems, changesets are the logical grouping of changes that represent the difference between two versions of software. In Git, a commit would be a changeset.

A changeset description is a message accompanying a changeset that describes the changeset in a human-readable format. In Git, this would correspond to a commit message.

A **fragment file** stores changeset descriptions as text that can be retrieved and combined with other changeset descriptions to create an updated changelog section or a release notes document. 

*In this document, the term "changeset file" is used as a shorthand for fragment files containing changeset descriptions.*

Fragment files in this project are created in YAML format. The changeset descriptions contained within fragment files follow a three-part structure:

- **Entry Prefix**: Categorizes changesets by type. The available options are `breaking`,`chore`, `deprecate`, `doc`,`feat`,`fix`,`infra`,`refactor`,`security`, and `test`.
  
- **Entry Description**: A concise, human-readable summary of the changeset.
  
- **PR Number and Link**: The pull request number the changeset is connected to, along with a link to the pull request on GitHub.

<p align="right">(<a href="#back-to-top">back to top</a>)</p>

## 4. Process Overview

The **Automated Changelog and Release Notes Process** is comprised of two independent sets of sub-processes: (1) the **Changelog Workflow Process** and (2) the **Release Notes Process**.

### 4.1. Changelog Workflow Process

The first sub-process involves a reusable [Github Action](https://docs.github.com/en/actions) that checks the validity of changeset files that have either been added manually or generated automatically based on the contents of PR descriptions (details below).

In order to generate changeset files automatically, the workflow communicates with an external service called the [OpenSearch Changelog PR Bridge](https://github.com/BigSamu/OpenSearch_Changeset_Bot). This bridge service can create changeset files on a contributor's behalf and commit them to the open PR.

The following flow diagram depicts the entire **Changelog Workflow Process** from start to finish.

![OpenSearch_Changelog_Workflow_Process](./assets/OpenSearch_Changelog_Process_Diagram.png)

> **NOTE**: Currently, the changelog process only supports the automatic creation of changeset files. Support for adding changeset files manually is forthcoming.

<p align="right">(<a href="#back-to-top">back to top</a>)</p>

#### 4.1.1. Changelog Process Entities

As the diagram illustrates, the **Changelog Workflow Process** involves interaction between two **GitHub Repositories**, two **External Services**, and one **GitHub App**. These components work together differently depending on whether or not a contributor has installed the App on their forked OpenSearch repository.

- **GitHub Repositories**

  - **OpenSearch Upstream Repository:** This is the base repository where a contributor's PR resides (e.g. [OpenSearch Dashboards](https://github.com/opensearch-project/OpenSearch-Dashboards), [OpenSearch UI Framework](https://github.com/opensearch-project/oui), [OpenSearch Neural Search](https://github.com/opensearch-project/neural-search), etc).
  
  - **Contributor Forked Repository:** The head repository from which the contributor's PR originates. It contains the changes the contributor is proposing to be merged into the base repository.

- **External Services**

  - **OpenSearch Changelog Action:** A reusable GitHub Action, invoked within a workflow file in an OpenSearch repository. This workflow is triggered whenever a PR is opened or edited. The reusable Action works only in the **OpenSearch Upstream Repository** and performs the following functions:

    - Check and parse contributor entries in a `## Changelog` section of an open PR description.
  
    - Post comments and add or remove labels on PRs.

    - Communicate with the **OpenSearch Changelog PR Bridge** to create, update, or delete changeset files automatically.

    - Validate the content of a changeset file created or updated by a contributor. (***support forthcoming*)

  - **OpenSearch Changelog PR Bridge:** An Express.js application that serves as the authorized entity for committing changeset files to an open PR on behalf of the contributor.

    <!-- - If a contributor has [installed the bot](https://github.com/apps/opensearch-changeset-bot) in their forked repository, the PR bridge service will receive HTTP requests from the **OpenSearch Changelog Workflow** and commit a changeset file to the branch in the contributor's repository where the PR has originated from. The PR bridge service acts only in the **Contributor Forked Repository**. -->

    <!-- - If a contributor has not installed the bot, the PR bridge service will communicate back to the **OpenSearch Changelog Workflow**, instructing it to look for and parse a manually-created changeset file. -->

- **GitHub App**
  - **OpenSearch Changelog Bot:** This GitHub App must be installed on the contributor's forked repository so that the contributor can grant permissions to the **OpenSearch Changelog PR Bridge** service to act on their behalf.

   <!-- As mentioned above, the App is installed in the **Contributor Forked Repository** and acts only to creating or updating changeset files. The source code and documentation for the bot is available in the [GitHub App's repository](https://github.com/BigSamu/OpenSearch_Changeset_Bot). -->

<p align="right">(<a href="#back-to-top">back to top</a>)</p>

#### 4.1.2. Changelog Process Jobs

As the diagram illustrates, the **Changelog Workflow Process** consists of three primary jobs:

- **Changelog Parsing:** The reusable Action checks first to see if the **OpenSearch Changelog Bot** (i.e., the GitHub App) has been installed in the **Contributor Forked Repository**. If so, the Action parses the `## Changelog` section of the open PR description. If not, the contributor is prompted to either install the bot or manually commit a changeset file.

  If the reusable Action is cleared to parse the `## Changelog` section from the PR, three outcomes are possible:

  1. **Parsing Failed:** If one or more entries in the `## Changelog` section are formatted improperly, the process will post an error comment and add a `failed changeset` label to the open PR. It will also delete any previously-committed changeset file.
   
  2. **Parsing Succeeded:** → If the entries in the `## Changelog` section are adequately formatted and the action succeeds in parsing them, then the **Automatic Changeset Creation/Update** job is initiated and the changelog process continues.
   
  3. **Skip Entry:** → If a contributor adds a `skip` entry in the PR description—meaning that the changes introduced (e.g., fixing a typo) do not warrant a changelog entry—then no changeset file will be created, and any existing changeset file will be deleted. A `Skip-Changelog` label will be added to the PR, and the changelog process will end successfully.

- **Automatic Changeset Creation/Update:** This second job is initiated after the `## Changelog` section from the PR description has been successfully parsed. In this job, the **OpenSearch Changelog Workflow** communicates with the **OpenSearch Changelog PR Bridge**. The bridge service creates or updates a changeset file and commits that file to the branch in the **Contributor Forked Repository** where the PR originated from. The **OpenSearch Changelog PR Bridge** receives the permissions to commit this file from the **OpenSearch Changelog Bot**.

- **Manual Changeset Creation/Update** → This third job is an alternative to the second one if the **OpenSearch Changelog Bot** App is not installed in the **Contributor Forked Repository**. In this case, the contributor must manually commit a changeset file to the branch they have opened their PR from. After the contributor commits a changeset file, the **OpenSearch Changelog Workflow** will check the formatting of the file. This check will end in one of two outcomes:

  1. **Check Failed**: If one or more entries in the changeset file are formatted incorrectly, the process will post an error comment and add a `failed changeset` label to the open PR.

  2. **Check Succeeded**: If the entries in the fragment file are correctly formatted, the changelog process will finish sucessfully.

<p align="right">(<a href="#back-to-top">back to top</a>)</p>


### 4.2. Release Notes Process

The **Release Notes Process** is a script that can be adapted to the needs of a particular OpenSearch repository. This script is included in the [releaseNotesTemplates](./releaseNotesTemplates/) directory. Please note that this script is *not executable* in its current form. It must either be configured according to the instructions below or customized to suit a different use case.

The **Release Notes Process** performs two primary actions:

1. Update the repository's `CHANGELOG.md` document with a new section detailing the changes that accompany a new version release.

2. Generate a release notes document tied to the new release and write that file to the repository's release notes directory.

#### 4.2.1 Update the Changelog Document

This script begins by reading the changeset files in the `changelogs/fragments/` directory. It uses a pre-established section map to group changelog entries together by shared category headings. The **Automated Changelog Process** facilitates this mapping by ensuring that changeset files have been correctly formatted and categorized.

As a precaution, the release notes script relocates the changeset files to a temporary directory. It then uses the mapped changelog entries to create a new section in the `CHANGELOG.md` document.

#### 4.2.2 Generate the Release Notes

Having done the work of mapping changelog entries and updating the `CHANGELOG.md` document, the script uses this prepared material to generate a release notes document. After adding this file to the repository's release notes directory, the script deletes the changeset files from their temporary location and exits the process successfully.

<p align="right">(<a href="#back-to-top">back to top</a>)</p>

## 5. Getting Started for OpenSearch Repository Maintainers

This section discusses in greater detail the steps required to implement the **Automated Changelog and Release Notes Process**.

### 5.1. Changelog Workflow Process

#### 5.1.1. Create a New `changelogs` Directory

To centralize information pertinent to the new changelog process, OpenSearch repositories will need to add a `changelogs` directory to their root directory.

Within the `changelog` directory, a subdirectory named `fragments` should be added. This subdirectory will hold all of the changeset files associated with the upcoming version release. *Only one changeset file may be generated per pull request.* These changeset files should be named according to the PR number they are associated with (e.g., `5218.yml`.)

Below is an example of what the `changelog` directory should look like. (The changeset files in this example are for illustration only.)

```
├── ...
└── changelogs
  └── fragments
      ├── 5218.yml
      ├── 5219.yml
      └── 5220.yml
```

<p align="right">(<a href="#back-to-top">back to top</a>)</p>

#### 5.1.2. Add a "Changelog" Section to the PR Description Template

The PR template should be updated with a `## Changelog` that looks like the following:

```md
...

## Changelog
<!--
Add each of the changelog entries as a line item in this section. e.g.
- fix: Updates the graph
- feat: Adds a new feature

If this change does not need to added to the changelog, just add a single `skip` line e.g.
- skip

Valid prefixes: breaking, chore, deprecate, doc, feat, fix, infra, refactor, test

Descriptions following the prefixes must be 100 characters or less
-->

...
```

The comment block in this section instructs contributors on how to properly format any changelog entries they add to their PR descriptions.

<p align="right">(<a href="#back-to-top">back to top</a>)</p>

#### 5.1.3. Add a Github Worflow File to Invoke the OpenSearch Changelog Action

In the `./github/workflows` directory of your OpenSearch repository, create a file called `opensearch_changelog_workflow.yml` and add the following code below:

```yaml
name: OpenSearch Changelog Workflow

on:
  pull_request_target:
    types: [opened, edited]

permissions:
  contents: read
  issues: write
  pull-requests: write

jobs:
  update-changelog:
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository
        uses: actions/checkout@v4
      - name: Parse changelog entries and submit request for changset creation
        uses: BigSamu/OpenSearch_Parse_Changelog_Action@main
        with:
          token: ${{secrets.GITHUB_TOKEN}}
```

Whenever a PR is opened or edited in an OpenSearch repository, this workflow will be triggered in the **OpenSearch Upstream Repository**.

<p align="right">(<a href="#back-to-top">back to top</a>)</p>

### 5.2. Release Notes Process

As mentioned above, the release notes process was designed for the specific context of the `OpenSearch-Dashboards` repository. Therefore, the following instructions demonstrate how to configure the script in that context. Implementation details may vary from repository to repository.

#### 5.2.1 Verify Core Modules and Install `js-yaml`

The script uses the following Node.js core modules:
- `path`
- `fs` (including `fs/promises`)

`fs/promises` has been a stable built-in module since Node version 14. So, depending on which version of Node you are using, it may already be installed in your `node-modules` directory. Still, it is worth verifying that these modules are accessible to your project.

In addition to these core modules, the release notes script utilizes `js-yaml` for parsing and writing YAML files. If it is not already among your project dependencies, you can install it from within your root directory via `npm` or `yarn`:

```bash
npm install js-yaml
```
```bash
yarn add js-yaml
```

<p align="right">(<a href="#back-to-top">back to top</a>)</p>

#### 5.2.2 Ensure Proper Location of Files and Directories

Because the release notes script reads from and writes to specific directories and files, it is important to ensure that the script is able to target the correct paths.

Below is a simplified directory tree showing where the script expects to find the various resources it needs to complete its tasks:

```
./
|  ├── changelogs/
|  |  ├── fragments/
|  |  |  ├── 5218.yml
|  |  |  ├── 5219.yml
|  |  |  └── 5220.yml
|  ├── release-notes/
|  ├── scripts/
|  |  ├── generate_release_note.js
|  |  └── use_node
|  ├── src/
|  |  ├── dev/
|  |  |  ├── generate_release_note.ts
|  |  |  └── generate_release_note_helper.ts
|  └── package.json
```

<p align="right">(<a href="#back-to-top">back to top</a>)</p>

#### 5.2.3 Configure Files and Script Command

<!-- prettier-ignore-start -->
<!-- omit in toc -->
##### 5.2.3.1 `package.json`
<!-- prettier-ignore-start -->
The release notes script is executed manually from the command line. To configure the command, the following line should be added to the `"scripts"` object in the `package.json` file:

```json
{
  "scripts": {
    "release_note:generate": "scripts/use_node scripts/generate_release_note"
  }
}
```

When invoked, `"release_note:generate"` script identifier runs a script command that executes the `generate_release_note` script within the appropriate Node.js runtime. It passes the `generate_release_note` script as an argument to the `use_node` script, which is available in the [OpenSearch-Dashboards repository](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/scripts/use_node) for reference.

Additionally, to generate accurate headings in the release notes document and changelog section, the script will need to be able to access the current product version. Please ensure that the `"version"` property in your `package.json` file is updated with the current release version.

<p align="right">(<a href="#back-to-top">back to top</a>)</p>

<!-- prettier-ignore-start -->
<!-- omit in toc -->
##### 5.2.3.2 `scripts/generate_release_note.js`
<!-- prettier-ignore-start -->

This file, located in the `scripts/` directory, imports the files necessary for the execution of the release notes script. It should be configured as follows:

```js
require('../src/setup_node_env');
require('../src/dev/generate_release_note');
require('../src/dev/generate_release_note_helper');
```
<!-- prettier-ignore-start -->
<!-- omit in toc -->
##### 5.2.3.3 `generate_release_note.ts` and `generate_release_note_helper.ts`
<!-- prettier-ignore-start -->

These files, available in the [releaseNotesTemplates](./releaseNotesTemplates/) directory in this repository, should be added to the `src/dev/` directory as indicated in the simplified directory tree above.

## 6. Usage for OpenSearch Maintainers and Contributors

This section discusses how maintainers and contributors can utilize the **Automated Changelog and Release Notes Process**.

### 6.1. Changelog Workflow Process

To make use of the changelog workflow when opening a PR, a contributor or maintainer can choose between two options. First, they can install the `OpenSearch_Changeset_Bot` on their repository/repositories to give the **OpenSearch Changelog PR Bridge** permission to commit changeset files on their behalf. This option will be called the "automatic approach" below.

Second, a contributor or maintainer can choose to commit their changeset files manually instead of authorizing the **OpenSearch Changelog PR Bridge** to do so on their behalf. This option is referred to below as the "manual approach".

#### 6.1.1. Automatic Approach

In order to use the **OpenSearch Changelog PR Bridge** service to commit changeset files on your behalf in any of your forked OpenSearch repositories:

- Navigate to the [OpenSearch-bot](https://github.com/apps/opensearch-changeset-bot) installation page and click "Install".

- Follow the instructions there and install this App in the forked OpenSearch repositories where you want to have this feature activated.

Once the App has been installed and you open a PR, find the `## Changelog` section in the PR description template and add a changelog entry/entries detailing the changes introduced in your PR.

Your entries in the `## Changelog` section must adhere to the following format:

- Each entry line must begin with a hyphen (-) in the Markdown source file.
  
- Following the hyphen, enter the category prefix that best represents the changes you are introducing. This prefix must be followed by a colon. Only the following category prefixes may be used:
  - `breaking`
  - `chore`
  - `deprecate`
  - `doc`
  - `feat`
  - `fix`
  - `infra`
  - `refactor`
  - `security`
  - `test`

- If the changes in a PR are minor (e.g., fixing a typo), you can enter `- skip` in the "Changelog" section to alert the `OpenSearch_Parse_Changelog_Action` that a changeset file is unnecessary.

  - ****NOTE:** If `-skip` is entered in the "Changelog" section, no other categories or descriptions can be present in the section.

- After the colon, provide a concise description of your changes, using the imperative mood. Descriptions must be 100 characters or less.

Below is an example of valid entries in the `## Changelog` section of the PR description:

```markdown
## Changelog

<!--
Add each of the changelog entries as a line item in this section. e.g.
- fix: Update the graph
- feat: Add a new feature

If this change does not need to added to the changelog, just add a single `skip` line e.g.
- skip

Valid prefixes: breaking, chore, deprecate, doc, feat, fix, infra, refactor, test

Descriptions following the prefixes must be 100 characters or less
-->

- feat: Add a new feature
- refactor: Improve an existing feature
- test: Add unit testing to new feature
- test: Update unit testing for existing feature
```

You can add more than one entry if your changes fall under more than one category prefix or represent discrete changes within the same category prefix. 

Also, you do not need to delete the comment block in the `## Changelog` section, although you can. If you leave the comment block, please ensure that the changelog entries you add lie _outside_ of the comment block.

Once you are finished adding the changelog entries and submitting the PR, the `OpenSearch Changelog Workflow` will run and create a changeset file in the `chagelog/fragments` directory that will look like the following example:

```yaml
# Changeset file 13.yml
feat:
  - Add a new feature ([#13](https://github.com/.../pull/13))

refactor:
  - Improve an existing feature ([#13](https://github.com/.../pull/13))

test:
  - Add unit testing to new feature ([#13](https://github.com/.../pull/13))
  - Update unit testing for existing feature ([#13](https://github.com/.../pull/13))
```

And the following update will appear in the PR conversation history:

![Changeset_Created_Updated_Commit_Message](./assets/Changeset_Created_Updated_Commit_Message.png)

This changeset file will become part of the code that is merged when the PR is approved.

If the Action encounters a `- skip` line in the PR, and there are no other changelog entries present, it will not create a changeset file. Instead, the process will add a `Skip-Changelog` label to the PR and terminate successfully:

![Skip_Changelog_Label_Commit_Message](./assets/Skip_Changelog_Label_Commit_Message.png)

Lastly, if the Action encounters an error (e.g., the PR description includes a category prefix but no changelog entry), it will post a comment in the commit history identifying the error, add a `failed changeset` label to the PR, and terminate:

![Error_Comment_and_Failed_Changeset_Label_Commit_Message.png](./assets/Error_Comment_and_Failed_Changeset_Label_Commit_Message.png)

Below are examples of improperly-formatted changelog entries that will cause the Action to throw an error:

**1. Including `- skip` in addition to other categories:**
```md
- skip
- feat: Add a new feature
```

**2. Adding a category prefix without a preceding hyphen:**
```md
feat: Add a new feature
```

**3. Using an invalid category prefix:**
```md
- new: Add something new
```

**4. Using a valid category prefix without an accompanying description:**
```md
- feat
```

**5. Including a description that is longer than 100 characters**
```md
- feat: Add a new feature that... [ > 100 characters]
```

<p align="right">(<a href="#back-to-top">back to top</a>)</p>

#### 6.1.2. Manual Approach

<img src="./assets/under-construction-warning-sign-vector.jpg" width="200">

<p align="right">(<a href="#back-to-top">back to top</a>)</p>

### 6.2. Release Notes Process

When a new product release is ready for general availability, OpenSearch maintainers can run the following script command from the command line, provided that the files and commands have been configured properly in the repository:

```bash
yarn release_note:generate
```
OR

```bash
npm run release_note:generate
```

This command will execute the script process detailed in section 5 above. If the process completes successfully, an updated changelog and a new release notes document will be available for publication. Maintainers should review both of these documents to ensure that they have been prepared and formatted as expected.

<p align="right">(<a href="#back-to-top">back to top</a>)</p>

## 7. Mantainers

- [Samuel Valdes Gutierrez](https://github.com/BigSamu) - OpenSearch Slack [link](https://opensearch.slack.com/archives/D05T6HWHLG3)
- [Johnathon Bowers](https://github.com/JohnathonBowers) - OpenSearch Slack [link](https://opensearch.slack.com/archives/D06075U158Q)

## 8. Contributing

The **Automated Changelog Release Notes Process** is the result of a concerted effort by OpenSearch maintainers and contributors to improve the development experience for all involved in OpenSearch suite.

Contributions to the **OpenSearch Changelog Workflow** and **OpenSearch **Release** Notes** services are welcome! See our [Developer Guide](./DEVELOPER_GUIDE.md) for instructions on how to set up the project in your local environment and [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

>**NOTE:** Bear in mind that for suggestions or contributions to the **OpenSearch Changelog PR Bridge** service, a distinct [repository](https://github.com/BigSamu/OpenSearch_Changeset_Bot) is used.

<p align="right">(<a href="#back-to-top">back to top</a>)</p>

## 9. License

This project is an open-source product released under the Apache 2.0 license (see either [the Apache site](https://www.apache.org/licenses/LICENSE-2.0) or the [LICENSE.txt file](./LICENSE.txt)). The Apache 2.0 license allows you to freely use, modify, distribute, and sell your own products that include Apache 2.0 licensed software.

<p align="right">(<a href="#back-to-top">back to top</a>)</p>

## 10. Need Help?

Feel free to contact us in the slack channel or by oppening an issue in this repo.
