/**
*   Some default values
*/
/*
 * Constants
 */
var PREFIX = "ov:";
var DEFAULT_LABEL = "Untitled";
var NO_LABEL = "";
var REQ_DEFAULT = 'yes';
var PROPERTIES_DEFAULT =  "<div class='option-item' ng-repeat='option in item.field_options'>\
                                <input type='checkbox' ng-checked='{{option.checked}}' ng-model='option.checked' ng-click='$parent.$parent.setSelect(item, option)'/>\
                                <input type='text' value='{{option.label}}' ng-model='option.label'/>\
                                <a class='mini-item item-add glyphicon-plus' ng-click='$parent.$parent.addOption(item, $index+1)'></a>\
                                <a class='mini-item item-remove glyphicon-minus' ng-click='$parent.$parent.removeOption(item, $index)'></a>\
                            </div>\
                            <button type='button' class='btn btn-primary btn-xs' ng-click='$parent.$parent.addOption(item, -1)'>Add option</button>";
var DEFAULT_LABEL_OPTION = "Option";
var DEFAULT_CHECK_OPTION = false;
var DEFAULT_SEMANTIC = {
                        class: null,
                        id: null,
                        property: null,
                        prefix: PREFIX,
                    };