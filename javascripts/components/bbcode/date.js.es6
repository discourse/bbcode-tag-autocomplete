import { action } from "@ember/object";
import Component from "@ember/component";

export default Component.extend({
  model: null,

  layoutName: "templates/components/bbcode/date",

  init() {
    this._super(...arguments);

    this.set("model.timezone", moment.tz.guess());
  },

  didReceiveAttrs() {
    this._super(...arguments);

    this.validate();
  },

  @action
  onChangeDate(date) {
    this.set("model.date", moment(date).format("YYYY-MM-DD"));
    this.validate();
  },

  validate() {
    this.set(
      "model.isValid",
      this.model.date &&
        moment(this.model.date).isValid() &&
        this.model.timezone
    );
  }
});
