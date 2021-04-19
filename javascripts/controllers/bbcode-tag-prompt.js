import Controller from "@ember/controller";
import ModalFunctionality from "discourse/mixins/modal-functionality";
import I18n from "I18n";

export default Controller.extend(ModalFunctionality, {
  // for now this is used only for so hardcoded
  date: null,
  onClosePromise: null,

  onClose() {
    const templateOptions = {
      date: this.date.format("YYYY-MM-DD"),
      timezone: moment.tz.guess()
    };

    this.onClosePromise(
      I18n.t(themePrefix(this.model.template), templateOptions)
    );
  }
});
