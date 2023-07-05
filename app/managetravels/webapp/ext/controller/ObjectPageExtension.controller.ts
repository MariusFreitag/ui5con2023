import ControllerExtension from 'sap/ui/core/mvc/ControllerExtension';
import ExtensionAPI from 'sap/fe/templates/ObjectPage/ExtensionAPI';
import Context from 'sap/ui/model/Context';
import Dialog from 'sap/m/Dialog';

/**
 * @namespace managetravels.ext.controller.ObjectPageExtension
 * @controller
 */
export default class ObjectPageExtension extends ControllerExtension<ExtensionAPI> {
	static overrides = {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf managetravels.ext.controller.ObjectPageExtension
		 */
		onInit(this: ObjectPageExtension) {
			// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
			const model = this.base.getExtensionAPI().getModel();
		},

		editFlow: {
			onBeforeSave(this: ObjectPageExtension) {
				const context = this.base
					.getExtensionAPI()
					.getBindingContext() as Context;

				if (!context.getProperty("GoGreen")) {
					return this.openDialog(context);
				}
			}
		}
	}

	private async openDialog(context: Context): Promise<void> {
		return new Promise(async (resolve, reject) => {
			const dialog = (await this.base.getExtensionAPI().loadFragment({
				id: "myFragment",
				initialBindingContext: context,
				name: "managetravels.ext.fragment.TreesDialog"
			})) as Dialog;

			dialog.attachAfterClose(() => {
				dialog.destroy();
				reject();
			});

			dialog.getBeginButton().attachPress(() => {
				dialog.close();
				resolve();
			});

			dialog.getEndButton().attachPress(() => {
				dialog.close();
				reject();
			});

			dialog.open();
		});
	}
}