'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {
  window,
  commands,
  Disposable,
  ExtensionContext,
  StatusBarAlignment,
  StatusBarItem,
  TextDocument,
} from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "hello-world" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let wordCounter = new WordCounter();
  let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
    // The code you place here will be executed every time your command is executed

    wordCounter.updateWordCount();
    // Display a message box to the user
    // vscode.window.showInformationMessage('Hello Izzy!');
  });

  context.subscriptions.push(wordCounter);
  context.subscriptions.push(disposable);
}

class WordCounter {
  private _statusBarItem: StatusBarItem = window.createStatusBarItem(
    StatusBarAlignment.Left
  );

  public updateWordCount() {
    // get the current text editor
    let editor = window.activeTextEditor;
    if (!editor) {
      this._statusBarItem.hide();
      return;
    }

    let doc = editor.document;

    // only update status if a markdown file
    if (doc.languageId === 'markdown') {
      let wordCount = this._getWordCount(doc);

      // update the status bar
      this._statusBarItem.text =
        wordCount !== 1 ? `${wordCount} Words` : '1 Word';
      this._statusBarItem.show();
    } else {
      this._statusBarItem.hide();
    }
  }

  public _getWordCount(doc: TextDocument): number {
    let docContent = doc.getText();

    // parse out unwanted whitespace so the split is accurate
    docContent = docContent.replace(/(< ([^>]+)<)/g, '').replace(/\s+/g, ' ');
    docContent = docContent.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    let wordCount = 0;
    if (docContent !== '') {
      wordCount = docContent.split(' ').length;
    }
    return wordCount;
  }
  dispose() {
    this._statusBarItem.dispose();
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
