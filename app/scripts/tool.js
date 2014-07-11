/*
 * Tool "Class"
 */
function Tool(name, selector, drawTool) {
  console.info(name);

  this.name = name || "Tool";
  this.selector = selector || "";
  this.master = drawTool;
  this.canvas = drawTool.canvas;
  this.active = false;
  this.singleUse = false;

  this.master.tools[selector] = this;

  this._listeners = [];

  this.initUI();
}

Tool.prototype.setActive = function (active) {
  // console.log(this.name + " active? " +  this.active);
  if (this.singleUse) {
    console.warn("This is a single use tool. It was not activated.");
    return;
  }
  if (this.active === active) { return active; }
  this.active = active;
  if (active === true){
    // this tool is now active
    console.log("Activating " + this.name);
    this.activate();
  } else {
    // this tool has been deselected
    console.log("Deactivating " + this.name);
    this.deactivate();
  }

  return active;
};

Tool.prototype.activate = function () {
  // console.warn(this.name + " at tool activation method");
  for (var i = 0; i < this._listeners.length; i++) {
    var trigger = this._listeners[i].trigger;
    var action = this._listeners[i].action;
    this.canvas.on(trigger, action);
  }
  this.$element.addClass('dt-active');
};

// This function will be called when user tries to activate a tool that
// is already active. It can enable some special behavior.
// Implement this function in a subclass when needed.
Tool.prototype.activateAgain = function () {};

// This function will be implemented by singleUse tools that do not need
// to be activated
Tool.prototype.use = function() {};

Tool.prototype.deactivate = function () {
  // console.warn(this.name + " at deactivation method");
  for (var i = 0; i < this._listeners.length; i++) {
    var trigger = this._listeners[i].trigger;
    var action = this._listeners[i].action;
    this.canvas.off(trigger);
  }
  this.$element.removeClass('dt-active');
};

Tool.prototype.addEventListener = function (eventTrigger, eventHandler) {
  this._listeners.push({
    trigger: eventTrigger,
    action: eventHandler
  });
};

Tool.prototype.removeEventListener = function (trigger) {
  for (var i = 0; i < this._listeners.length; i++) {
    if (trigger == this._listeners[i].trigger){
      return this._listeners.splice(i,1);
    }
  }
};

Tool.prototype.initUI = function () {
  this.$element = $('<div class="dt-btn">')
    .attr('id', this.selector)
    .appendTo(this.master.$tools);
  $('<span>')
    .appendTo(this.$element);
};

Tool.prototype.setLabel = function (label) {
  this.$element.find('span').text(label);
};

module.exports = Tool;