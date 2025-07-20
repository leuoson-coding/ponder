# Ponder IDE - Intelligent Code Editor

[![Feature Requests](https://img.shields.io/github/issues/your-org/ponder/feature-request.svg)](https://github.com/your-org/ponder/issues?q=is%3Aopen+is%3Aissue+label%3Afeature-request+sort%3Areactions-%2B1-desc)
[![Bugs](https://img.shields.io/github/issues/your-org/ponder/bug.svg)](https://github.com/your-org/ponder/issues?utf8=✓&q=is%3Aissue+is%3Aopen+label%3Abug)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/your-org/ponder/blob/main/LICENSE.txt)

## The Repository

This repository is where we develop **Ponder IDE**, an intelligent code editor built on the foundation of Visual Studio Code with enhanced features and customizations. We work on code and issues here, and publish our development progress and plans. This source code is available to everyone under the standard [MIT license](https://github.com/your-org/ponder/blob/main/LICENSE.txt).

## Ponder IDE

<p align="center">
  <img alt="Ponder IDE in action" src="https://github.com/your-org/ponder/raw/main/resources/screenshots/ponder-ide-screenshot.png">
</p>

**Ponder IDE** is an intelligent code editor that combines the simplicity of a text editor with what developers need for their core edit-build-debug cycle. Built on the foundation of Visual Studio Code, Ponder IDE provides comprehensive code editing, navigation, and understanding support along with lightweight debugging, a rich extensibility model, and seamless integration with existing tools.

Key features include:
- **Enhanced Intelligence**: Advanced code completion and analysis
- **Customizable Interface**: Tailored user experience and themes
- **Integrated Authentication**: Built-in Ponder service integration
- **Extended Language Support**: Comprehensive programming language support

Ponder IDE is actively developed with regular updates featuring new capabilities and improvements. You can download it for Windows, macOS, and Linux from our [releases page](https://github.com/your-org/ponder/releases). For the latest development builds, check our [development branch](https://github.com/your-org/ponder/tree/dev).

## Contributing

There are many ways in which you can participate in this project, for example:

* [Submit bugs and feature requests](https://github.com/your-org/ponder/issues), and help us verify as they are checked in
* Review [source code changes](https://github.com/your-org/ponder/pulls)
* Review the [documentation](https://github.com/your-org/ponder-docs) and make pull requests for anything from typos to additional and new content

If you are interested in fixing issues and contributing directly to the code base,
please see the document [How to Contribute](https://github.com/microsoft/vscode/wiki/How-to-Contribute), which covers the following:

* [How to build and run from source](https://github.com/your-org/ponder/wiki/How-to-Contribute)
* [The development workflow, including debugging and running tests](https://github.com/your-org/ponder/wiki/How-to-Contribute#debugging)
* [Coding guidelines](https://github.com/your-org/ponder/wiki/Coding-Guidelines)
* [Submitting pull requests](https://github.com/your-org/ponder/wiki/How-to-Contribute#pull-requests)
* [Finding an issue to work on](https://github.com/your-org/ponder/wiki/How-to-Contribute#where-to-contribute)
* [Contributing to translations](https://github.com/your-org/ponder/wiki/Translations)

## Feedback

* Ask a question on [Stack Overflow](https://stackoverflow.com/questions/tagged/ponder-ide)
* [Request a new feature](CONTRIBUTING.md)
* Upvote [popular feature requests](https://github.com/your-org/ponder/issues?q=is%3Aopen+is%3Aissue+label%3Afeature-request+sort%3Areactions-%2B1-desc)
* [File an issue](https://github.com/your-org/ponder/issues)
* Connect with the community on [GitHub Discussions](https://github.com/your-org/ponder/discussions)
* Follow [@PonderIDE](https://twitter.com/PonderIDE) and let us know what you think!

See our [wiki](https://github.com/your-org/ponder/wiki/Feedback-Channels) for a description of each of these channels and information on some other available community-driven channels.

## Related Projects

Many of the core components and extensions to Ponder IDE live in their own repositories on GitHub. For example, language servers and debug adapters are maintained as separate projects. For a complete list, please visit the [Related Projects](https://github.com/your-org/ponder/wiki/Related-Projects) page on our [wiki](https://github.com/your-org/ponder/wiki).

## Bundled Extensions

Ponder IDE includes a set of built-in extensions located in the [extensions](extensions) folder, including grammars and snippets for many languages. Extensions that provide rich language support (code completion, Go to Definition) for a language have the suffix `language-features`. For example, the `json` extension provides coloring for `JSON` and the `json-language-features` extension provides rich language support for `JSON`.

## Development Container

This repository includes a Ponder IDE Dev Containers / GitHub Codespaces development container.

* For [Dev Containers](https://containers.dev/), use the **Dev Containers: Clone Repository in Container Volume...** command which creates a Docker volume for better disk I/O on macOS and Windows.
  * If you already have Ponder IDE and Docker installed, you can clone the repository and open it in a dev container for development.

* For Codespaces, install the [GitHub Codespaces](https://marketplace.visualstudio.com/items?itemName=GitHub.codespaces) extension in Ponder IDE, and use the **Codespaces: Create New Codespace** command.

Docker / the Codespace should have at least **4 Cores and 6 GB of RAM (8 GB recommended)** to run full build. See the [development container README](.devcontainer/README.md) for more information.

## Code of Conduct

This project has adopted a Code of Conduct to ensure a welcoming environment for all contributors. For more information see our [Code of Conduct](CODE_OF_CONDUCT.md) or contact the project maintainers with any questions or concerns.

## License

Copyright (c) Ponder Team. All rights reserved.

Licensed under the [MIT](LICENSE.txt) license.
