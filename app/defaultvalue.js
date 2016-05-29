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
var PROPERTIES_DEFAULT_RADIO =  "<div class='option-item' ng-repeat='option in item.field_options'>\
                                <input type='radio' ng-value='true' ng-checked='{{option.checked}}' ng-model='option.checked' ng-click='$parent.$parent.setSelect(item, option)'/>\
                                <input type='text' value='{{option.label}}' ng-model='option.label'/>\
                                <a class='mini-item item-add glyphicon-plus' ng-click='$parent.$parent.addOption(item, $index+1)'></a>\
                                <a class='mini-item item-remove glyphicon-minus' ng-click='$parent.$parent.removeOption(item, $index)'></a>\
                            </div>\
                            <button type='button' class='btn btn-primary btn-xs' ng-click='$parent.$parent.addOption(item, -1)'>Add option</button>";

var DEFAULT_LABEL_OPTION = "Option";
var DEFAULT_CHECK_OPTION = false;
var DEFAULT_SEMANTIC = {class: null, id: null, property: null, prefix: PREFIX};
var DEFAULT_OPTIONS = [{label: "Untitled 1", checked: false}, {label: "Untitled 2", checked: false}];

var CHECK_SIGNED_STRING = "-----BEGIN PGP SIGNED MESSAGE-----";

var COMPONENT_TEXT = "<input data-oid='{{item.id}}' type='text' value='{{item.value}}' property='{{item.semantic.prefix}}{{item.semantic.property}}' content='{{item.value}}' class='form-control' ng-model='item.value' ng-required='{{item.required}}' title='Text is required'/>";
var COMPONENT_NUMBER = "<input data-oid='{{item.id}}' type='number' value='{{item.value}}' property='{{item.semantic.prefix}}{{item.semantic.property}}' content='{{item.value}}' class='form-control' ng-model='item.value' ng-required='{{item.required}}' title='Number is required'/>";
var COMPONENT_DATE = "<input data-oid='{{item.id}}' type='date' value='{{item.value}}' property='{{item.semantic.prefix}}{{item.semantic.property}}' content='{{item.value}}' class='form-control' ng-model='item.value' ng-required='{{item.required}}'title='Date is required'/>";
var COMPONENT_EMAIL = "<input data-oid='{{item.id}}' type='email' value='{{item.value}}' property='{{item.semantic.prefix}}{{item.semantic.property}}' content='{{item.value}}' class='form-control' ng-model='item.value' ng-required='{{item.required}}' title='Email format example is user@domain.com'/>";
var COMPONENT_TEXTAREA = "<textarea data-oid='{{item.id}}' rows='3' property='{{item.semantic.prefix}}{{item.semantic.property}}' content='{{item.value}}' class='form-control' ng-model='item.value' ng-required='{{item.required}}' title='Text is required'/>{{item.value}}</textarea>";
var COMPONENT_RADIO = "<input data-oid='{{item.id}}' type='radio' property='{{item.semantic.prefix}}{{item.semantic.property}}' data-property2='{{item.semantic.prefix}}{{item.semantic.property}}' name='{{item.name}}{{item.id}}' ng-repeat-start='option in item.field_options' data-label='{{option.label}}' ng-model='option.checked' ng-value='true' content='{{option.label}}' ng-click='$parent.$parent.setSelect(item, option)' ng-required='{{item.required}}'/><span class='opt'>{{option.label}}</span><br ng-repeat-end/>";
var COMPONENT_CHECKBOX = "<input data-oid='{{item.id}}' type='checkbox' property='{{item.semantic.prefix}}{{item.semantic.property}}' data-property2='{{item.semantic.prefix}}{{item.semantic.property}}' name='{{item.name}}{{item.id}}' ng-model='option.checked' ng-repeat-start='option in item.field_options' value='{{option.label}}' content='{{option.label}}' ng-click='$parent.$parent.setSelect(item, option)'/><span class='opt'>{{option.label}}</span><br ng-repeat-end />";
var COMPONENT_SELECT = "<select data-oid='{{item.id}}' class='form-control' property='{{item.semantic.prefix}}{{item.semantic.property}}' content='{{item.value.label}}' ng-model='item.value' ng-options='option.label for option in item.field_options' ng-required='{{item.required}}'></select>";
var COMPONENT_SIGNATURE = "<input data-oid='{{item.id}}' class= 'fileupload' fileimage type-mode=1 ng-model='item.value' data-tempproperty='{{item.semantic.prefix}}{{item.semantic.property}}' type='file' accept='image/*' ng-required='{{item.required}}' title='Image format is required, one image only'/><div ng-repeat-start='img in item.value' class='image-line'><span>{{img.name}}</span><img alt='' property='{{item.semantic.prefix}}{{item.semantic.property}}' src='{{img.src}}' title='{{img.name}}'><button ng-click='$parent.$parent.deleteImage(item,img)'>Remove</button></div><br ng-repeat-end />";
var COMPONENT_ATTACH = "<input data-oid='{{item.id}}' class= 'fileupload' fileimage type-mode=2 ng-model='item.value' data-tempproperty='{{item.semantic.prefix}}{{item.semantic.property}}' type='file' multiple accept='image/*' ng-required='{{item.required}}' title='Image format is required, at least one image is required'/><div ng-repeat-start='img in item.value' class='image-line'><span>{{img.name}}</span><img alt='' property='{{item.semantic.prefix}}{{item.semantic.property}}' src='{{img.src}}' title='{{img.name}}' ><button ng-click='$parent.$parent.deleteImage(item,img)'>Remove</button></div><br ng-repeat-end />";
var COMPONENT_HEADER = "<textarea data-oid='{{item.id}}' class='form-control' ng-model='item.label'/></textarea>";
var COMPONENT_SECTION = COMPONENT_HEADER;
var COMPONENT_STATICTEXT = COMPONENT_HEADER;

