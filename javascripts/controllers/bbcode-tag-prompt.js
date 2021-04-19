import { action } from "@ember/object";
import EmberObject from "@ember/object";
import Controller from "@ember/controller";
import ModalFunctionality from "discourse/mixins/modal-functionality";
import I18n from "I18n";

export default Controller.extend(ModalFunctionality, {
  onClosePromise: null,

  componentModel: null,

  onShow() {
    this.set("componentModel", EmberObject.create({}));
  },

  @action
  insertTag() {
    this.onClosePromise(
      I18n.t(
        themePrefix(this.model.template),
        JSON.parse(JSON.stringify(this.componentModel))
      )
    );
    this.send("closeModal");
  }
});
