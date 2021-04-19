import { on } from "discourse-common/utils/decorators";
import showModal from "discourse/lib/show-modal";
import { findRawTemplate } from "discourse-common/lib/raw-templates";
import { ajax } from "discourse/lib/ajax";
import { withPluginApi } from "discourse/lib/plugin-api";

const autocompletes = [
  {
    translatedName: "Date",
    template: "discourse_local_dates.bbcode_autocomplete.template"
  }
];

export default {
  name: "bbcode-tag-autocomplete",

  initialize() {
    withPluginApi("0.11.2", api => {
      api.modifyClass("component:d-editor", {
        @on("didInsertElement")
        _applyBbcodeTagAutocomplete() {
          console.log("????");

          $(this.element.querySelector(".d-editor-input")).autocomplete({
            template: findRawTemplate("templates/bbcode-tag-autocomplete"),

            key: "!",

            preserveKey: false,

            afterComplete: value => {
              this.set("value", value);
              return this._focusTextArea();
            },

            transformComplete: model => {
              const modalController = showModal("bbcode-tag-prompt", {
                model
              });

              return new Promise(resolve => {
                modalController.onClosePromise = resolve;
              });
            },

            dataSource: term => {
              if (term.match(/\s/)) {
                return null;
              }

              // if used in core this processing step would be in plugin api
              const processedAutocompletes = autocompletes.map(a => {
                const name = a.translatedName || I18n.t(themePrefix(a.name));
                const template = a.translatedTemplate || a.template;
                const prompts = a.prompts || [];

                return {
                  name,
                  template,
                  prompts
                };
              });

              return processedAutocompletes.filter(
                bbcode =>
                  bbcode.name.toLowerCase().indexOf(term.toLowerCase()) > -1
              );
            }
          });
        }
      });
    });
  }
};
