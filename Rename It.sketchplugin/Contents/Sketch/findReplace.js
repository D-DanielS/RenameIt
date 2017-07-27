function createDialog()
{
	var alert = COSAlertWindow.new();

	function createTextFieldWithLabel(label,defaultValue) {
			alert.addTextLabelWithValue(label);
			alert.addTextFieldWithValue(defaultValue);
	}

	alert.setMessageText("Find & Replace");
	alert.setInformativeText("Find and replace text in the selected layer(s) * CASE SENSITIVE *");

	// Name
	createTextFieldWithLabel("Find:","");
	var firstField = alert.viewAtIndex(1)

	// Interator
	createTextFieldWithLabel("Replace with:","");
	var secondField = alert.viewAtIndex(3)

	// Set first responder
	alert.alert().window().setInitialFirstResponder(firstField)
	firstField.setNextKeyView(secondField)

	// Actions buttons.
	alert.addButtonWithTitle('OK');
	alert.addButtonWithTitle('Cancel');

	return alert;
}

function handleAlertResponse(alert, responseCode) {
		if (responseCode == "1000") {
				return {
						findText: alert.viewAtIndex(1).stringValue(),
						replaceWith: alert.viewAtIndex(3).stringValue()
				}
		}

		return null;
}

var findReplace = function(context) {
	var selection = context.selection
	var selectionCount = [selection count]
	var doc = context.document
  if (selectionCount > 0)
  {
		// Show dialog
		var alert = createDialog();
		var options=handleAlertResponse(alert,alert.runModal());

    // Run on all selections
    for (var i=0; i<selectionCount; i++) {
        var layer = selection[i];
        var name = replaceText([layer name], i, options.findText, options.replaceWith, doc);
        [layer setName:name];

		// Prevent textlayer name from being renamed after editing
		layer.nameIsFixed = 1;

    	// Success message
    	[doc showMessage: "Rename it: Updated "+selectionCount+" layer(s)"];
    }
  }
  else
  {
      // No layer selected
      [doc showMessage: "Rename it: You need to select at least one layer"];
  }
}

function replaceText(layerName, currIdx, findText, replaceWith, doc) {
  function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }
  var reg = new RegExp(escapeRegExp(findText), "g");
  var found = layerName.match(reg);
  if (found == null) {
    [doc showMessage: "Rename it: Couldn't find a match for: "+ layerName];
    return layerName;
  }
  else {
    return layerName.replace(reg, replaceWith);
  }

}