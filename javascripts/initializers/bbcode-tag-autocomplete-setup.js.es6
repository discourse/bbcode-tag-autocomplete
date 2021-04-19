import { getOwner } from "discourse-common/lib/get-owner";
import { on } from "discourse-common/utils/decorators";
import showModal from "discourse/lib/show-modal";
import { findRawTemplate } from "discourse-common/lib/raw-templates";
import { ajax } from "discourse/lib/ajax";
import { withPluginApi } from "discourse/lib/plugin-api";

const autocompletes = [
  {
    name: "discourse_local_dates.bbcode_autocomplete.name",
    template: "discourse_local_dates.bbcode_autocomplete.template",
    component: "bbcode/date"
  },
  {
    name: "details.bbcode_autocomplete.name",
    template: "details.bbcode_autocomplete.template"
  }
];

export default {
  name: "bbcode-tag-autocomplete",

  initialize() {
    withPluginApi("0.11.2", api => {
      api.modifyClass("component:d-editor", {
        @on("didInsertElement")
        _applyBbcodeTagAutocomplete() {
          $(this.element.querySelector(".d-editor-input")).autocomplete({
            template: findRawTemplate("templates/bbcode-tag-autocomplete"),

            key: "!",

            preserveKey: false,

            afterComplete: value => {
              this.set("value", value);
              return this._focusTextArea();
            },

            transformComplete: (model, me) => {
              if (model.component) {
                const modalController = showModal("bbcode-tag-prompt", {
                  model
                });

                return new Promise(resolve => {
                  modalController.onClosePromise = resolve;
                });
              } else {
                return I18n.t(themePrefix(model.template));
              }
            },

            dataSource: term => {
              if (term.match(/\s/)) {
                return null;
              }

              // if used in core this processing step would be in plugin api
              const processedAutocompletes = autocompletes.map(a => {
                const name = a.translatedName || I18n.t(themePrefix(a.name));
                const template = a.translatedTemplate || a.template;

                return {
                  name,
                  template,
                  component: a.component
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
