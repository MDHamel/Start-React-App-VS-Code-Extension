import * as vscode from 'vscode';

let myStatusBarItem: vscode.StatusBarItem;
const terminal:vscode.Terminal = vscode.window.createTerminal({ name: 'npm' });

export function activate({ subscriptions }: vscode.ExtensionContext) {

	const npmCommand = 'npm run start';
	const imagePath = vscode.Uri.file('/media/icon.png');
	let isRunning:boolean = false;


	const myCommandId = 'mdhamel.startReactApp';
	
	subscriptions.push(vscode.commands.registerCommand(myCommandId, () => {
		if(isRunning){
			terminal.sendText('\x03 \n');
			myStatusBarItem.text = `$(broadcast) Start React App`;
			myStatusBarItem.show();
			isRunning = false;
		}
		else{
			terminal.sendText(npmCommand + "\n");
			myStatusBarItem.text = `$(radio-tower) React App Running`;
			myStatusBarItem.show();
			isRunning = true;
		}
	}));

	// create a new status bar item that we can now manage
	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 7);
	myStatusBarItem.command = myCommandId;
	subscriptions.push(myStatusBarItem);

	myStatusBarItem.text = `$(broadcast) Start React App`;
	myStatusBarItem.show();
}
