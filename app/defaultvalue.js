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
var DEFAULT_SEMANTIC = { class: null, id: null, property: null, prefix: PREFIX};
var DEFAULT_OPTIONS = [{label: "Untitled 1", checked: false}, {label: "Untitled 2", checked: false}];

var CHECK_SIGNED_STRING = "-----BEGIN PGP SIGNED MESSAGE-----";

var COMPONENT_TEXT = "<input disabled value='{{item.value}}' type='text' property='{{item.semantic.prefix}}{{item.semantic.property}}' content='{{item.value}}' class='form-control' ng-model='item.value' /><div class='input-validation'></div>";
var COMPONENT_NUMBER = "<input disabled value='{{item.value}}' type='number' property='{{item.semantic.prefix}}{{item.semantic.property}}' content='{{item.value}}' class='form-control' ng-model='item.value'/><div class='input-validation'></div>";
var COMPONENT_DATE = "<input disabled value='{{item.value}}' type='date' property='{{item.semantic.prefix}}{{item.semantic.property}}' content='{{item.value}}' class='form-control' ng-model='item.value'/><div class='input-validation'></div>";
var COMPONENT_EMAIL = "<input disabled value='{{item.value}}' type='email' property='{{item.semantic.prefix}}{{item.semantic.property}}' content='{{item.value}}' class='form-control' ng-model='item.value'/><div class='input-validation'></div>";
var COMPONENT_TEXTAREA = "<textarea disabled value='{{item.value}}' rows='3' property='{{item.semantic.prefix}}{{item.semantic.property}}' content='{{item.value}}' class='form-control' ng-model='item.value' />{{item.value}}</textarea>";
var COMPONENT_RADIO = "<input disabled type='radio' property='{{item.semantic.prefix}}{{item.semantic.property}}' property2='{{item.semantic.prefix}}{{item.semantic.property}}' name='{{item.name}}{{item.id}}' ng-repeat-start='option in item.field_options' data='{{option.label}}' ng-model='option.checked' ng-value='true' content='{{option.label}}' ng-click='$parent.$parent.setSelect(item, option)' /><span class='opt'>{{option.label}}</span><br ng-repeat-end/>";
var COMPONENT_CHECKBOX = "<input disabled type='checkbox' property='{{item.semantic.prefix}}{{item.semantic.property}}' property2='{{item.semantic.prefix}}{{item.semantic.property}}' name='{{item.name}}{{item.id}}' ng-model='option.checked' ng-repeat-start='option in item.field_options' value='{{option.label}}' content='{{option.label}}' ng-click='$parent.$parent.setSelect(item, option)'/><span class='opt'>{{option.label}}</span><br ng-repeat-end />";
var COMPONENT_SELECT = "<select disabled class='form-control' property='{{item.semantic.prefix}}{{item.semantic.property}}' content='{{item.value.label}}' ng-model='item.value' ng-options='option.label for option in item.field_options'></select>";
var COMPONENT_SIGNATURE = "<input disabled class= 'fileupload' fileimage type-mode=1 ng-model='item.value' tempproperty='{{item.semantic.prefix}}{{item.semantic.property}}' type='file'/><div ng-repeat-start='img in item.value' class='image-line'><span>{{img.name}}</span><img property='{{item.semantic.prefix}}{{item.semantic.property}}' src='{{img.src}}' title='{{img.name}}'><button ng-click='$parent.$parent.deleteImage(item,img)'>Remove</button></div><br ng-repeat-end />";
var COMPONENT_ATTACH = "<input disabled class= 'fileupload' fileimage type-mode=2 ng-model='item.value' tempproperty='{{item.semantic.prefix}}{{item.semantic.property}}' type='file' multiple/><div ng-repeat-start='img in item.value' class='image-line'><span>{{img.name}}</span><img property='{{item.semantic.prefix}}{{item.semantic.property}}' src='{{img.src}}' title='{{img.name}}' ><button ng-click='$parent.$parent.deleteImage(item,img)'>Remove</button></div><br ng-repeat-end />";
var COMPONENT_HEADER = "<h3><input type='text' class='form-control'  ng-model='item.label' /></h3>";
var COMPONENT_SECTION = "<h3><input type='text' class='form-control' ng-model='item.label' /></h3>";