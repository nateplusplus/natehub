import 'babylonjs';

export default class PlayerInput
{
	constructor( scene ) {
		scene.actionManager = new BABYLON.ActionManager( scene );

		this.inputMap = {};

		scene.actionManager.registerAction( new BABYLON.ExecuteCodeAction( BABYLON.ActionManager.OnKeyDownTrigger, (evt) => {
			this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
		}));
		scene.actionManager.registerAction( new BABYLON.ExecuteCodeAction( BABYLON.ActionManager.OnKeyUpTrigger, (evt) => {
			this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
		}));
		scene.onBeforeRenderObservable.add( () => {
			this.updateFromKeyboard();
		});
	}

	updateFromKeyboard() {
		if (this.inputMap["w"]) {
			this.vertical = BABYLON.Scalar.Lerp(this.vertical, 1, 0.2);
			this.verticalAxis = 1;
		} else if (this.inputMap["s"]) {
			this.vertical = BABYLON.Scalar.Lerp(this.vertical, -1, 0.2);
			this.verticalAxis = -1;
		} else {
			this.vertical = 0;
			this.verticalAxis = 0;
		}
		if (this.inputMap["a"]) {
			this.horizontal = BABYLON.Scalar.Lerp(this.horizontal, -1, 0.2);
			this.horizontalAxis = -1;
		} else if (this.inputMap["d"]) {
			this.horizontal = BABYLON.Scalar.Lerp(this.horizontal, 1, 0.2);
			this.horizontalAxis = 1;
		}
		else {
			this.horizontal = 0;
			this.horizontalAxis = 0;
		}
	}
}