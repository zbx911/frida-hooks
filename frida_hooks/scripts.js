var _is_color_mode = true
const clr_reset = () => _is_color_mode? "\x1B[0m": '';

const clr_black = (text) => clr_ansify("\x1B[0;30m", text);
const clr_dark_gray = (text) => clr_ansify("\x1B[1;30m", text);
const clr_blue = (text) => clr_ansify("\x1B[0;34m", text);
const clr_bright_blue = (text) => clr_ansify("\x1B[1;34m", text);
const clr_green = (text) => clr_ansify("\x1B[0;32m", text);
const clr_bright_green = (text) => clr_ansify("\x1B[1;32m", text);
const clr_cyan = (text) => clr_ansify("\x1B[0;36m", text);
const clr_bright_cyan = (text) => clr_ansify("\x1B[1;36m", text);
const clr_red = (text) => clr_ansify("\x1B[0;31m", text);
const clr_bright_red = (text) => clr_ansify("\x1B[1;31m", text);
const clr_purple = (text) => clr_ansify("\x1B[0;35m", text);
const clr_bright_purple = (text) => clr_ansify("\x1B[1;35m", text);
const clr_brown = (text) => clr_ansify("\x1B[0;33m", text);
const clr_yellow = (text) => clr_ansify("\x1B[1;33m", text);
const clr_bright_gray = (text) => clr_ansify("\x1B[0;37m", text);
const clr_white = (text) => clr_ansify("\x1B[1;37m", text);
const clr_bg_black = (text) => clr_ansify("\x1B[40m", text);
const clr_bg_red = (text) => clr_ansify("\x1B[41m", text);
const clr_bg_green = (text) => clr_ansify("\x1B[42m", text);
const clr_bg_yellow = (text) => clr_ansify("\x1B[43m", text);
const clr_bg_blue = (text) => clr_ansify("\x1B[44m", text);
const clr_bg_purple = (text) => clr_ansify("\x1B[45m", text);
const clr_bg_cyan = (text) => clr_ansify("\x1B[46m", text);
const clr_bg_white = (text) => clr_ansify("\x1B[47m", text);
const clr_bright = (text) => clr_ansify("\x1B[1m", text);
const clr_dim = (text) => clr_ansify("\x1B[2m", text);
const clr_underline = (text) => clr_ansify("\x1B[4m", text);
const clr_blink = (text) => clr_ansify("\x1B[5m", text);
const clr_reverse = (text) => clr_ansify("\x1B[7m", text);
const clr_strikethrough = (text) => clr_ansify("\x1B[9m", text);
const clr_overline = (text) => clr_ansify("\x1B[53m", text);

// return an ansified string
const clr_ansify = (color, ...msg) => _is_color_mode? color + msg.join(``) + "\x1B[0m": msg.join(``);

const not_safe_classes = {
    "androidx.appcompat.widget.AppCompatTextClassifierHelper": true,
    "androidx.core.text.PrecomputedTextCompat$Params": true,
    "androidx.core.text.PrecomputedTextCompat": true,
    "android.support.v4.text.c$a": true,
    "android.support.v4.text.c": true,
    "android.support.v4.text.PrecomputedTextCompat$Params": true,
    "android.support.v4.text.PrecomputedTextCompat": true,
    "com.taobao.taopai.business.ShareMainNewActivity": true,
    "com.facebook.imagepipeline.image.EncodedImage": true,
    "com.facebook.imageutils.ImageMetaData": true,
    "androidx.appcompat.widget.k": true,
    "androidx.core.app.JobIntentService$f$a": true,
    "com.amap.api.col.sl2.c9": true,
    "androidx.media.k$a": true,
    "com.facebook.imagepipeline.common.ImageDecodeOptions": true,
    "com.ss.ttvideoengine.strategrycenter.StrategyCenter": true,
    "com.facebook.imagepipeline.common.ImageDecodeOptionsBuilder": true,
    "com.alibaba.android.arouter.facade.model.RouteMeta": true,
    "com.alibaba.android.arouter.facade.Postcard": true,
    "androidx.core.view.accessibility.AccessibilityNodeInfoCompat$TouchDelegateInfoCompat": true,
}

const BASIC_CLASSES = ["java.lang.","java.util.","java.io.","java.net.","java.sql.","java.awt.","java.swing.","java.text."];

const FLAG_ACTIVITY_NEW_TASK = 0x10000000;
const ACTION_VIEW = "android.intent.action.VIEW";

var dex_list = [];
var native_list = [];
var tls_key_logger_started = false;
var tls_key_list = [];

var okhttp3_client = null;
var is_show_cert_file = true;

function set_color_mode(is_color_mode){
    _is_color_mode = is_color_mode
}

function sleep(ms) {
    try {
        Java.use("java.lang.Thread").sleep(ms);
    } catch (e) {
        console.error(e)
    }
//    return new Promise((resolve) => {
//        setTimeout(resolve, ms);
//    });
}

function wrap_java_perform(fn){
  return new Promise((resolve, reject) => {
    Java.perform(() => {
      try {
        resolve(fn());
      } catch (e) {
        reject(e);
      }
    });
  });
}

function send_msg(data){
    if(data){
        send(data);
    }
}

function send_arguments_info(func_name, args, no_stack){
    try{
        var datas = [];
        if(!no_stack){
            var timestamp = (new Date()).getTime();
            datas.push({type:"stack", data:get_stack_trace(), timestamp:timestamp, funcName:func_name});
        }
        let args_info = get_arguments(args, args.length);
        datas.push({type:"arguments", before:JSON.stringify(args_info)});
        send(datas);
    }catch(e){
        console.error(e);
    }
}

function is_basic_class(class_name){
    if(!class_name){
        return true;
    }else{
        for(var i = 0; i < BASIC_CLASSES.length; i++) {
            if(class_name.indexOf(BASIC_CLASSES[i]) >= 0){
                return true;
            }
        }
        return false;
    }
}

function is_map(class_name){
    return class_name && (class_name.indexOf('java.util.Map') >= 0 || class_name.indexOf('java.util.HashMap') >= 0);
}

function is_collection(class_name){
    return class_name && (class_name.indexOf('java.util.Collection') >= 0 || class_name.indexOf('java.util.ArrayList') >= 0);
}

function java_use_safe(class_name){
    let cls = null;
    try{
        if(!not_safe_classes[class_name]){
            return Java.use(class_name);
        }
    }catch(e){
    }
    return cls;
}

function get_real_class_name(object) {
    if(object != undefined && object != null){
        try {
            const objClass = Java.use("java.lang.Object").getClass.apply(object);
            return Java.use("java.lang.Class").getName.apply(objClass)
        } catch (e) {
            return get_class_safe(object);
        }
    }
    return ''
}

function is_instance_of(object, className){
    let result = false;
    try {
        const targetClass = Java.use(className);
        const newObject = Java.cast(object, targetClass);
        result = !!newObject;
    } catch (e) {
        result = false;
    }
    return result;
};

function get_methods_safe(class_name){
    let methods = [];
    try{
        if(!not_safe_classes[class_name]){
            let cls = Java.use(class_name);
            methods = cls.class.getDeclaredMethods();
        }
    }catch(e){
    }
    return methods;
}

function has_method(obj, method) {
    let class_name = get_real_class_name(obj);
    let method_array = get_methods_safe(class_name);
    for (let i = 0; i < method_array.length; i++) {
        let cur_method = method_array[i]; //当前方法
        let str_method_name = cur_method.getName(); //当前方法名
        if(str_method_name == method){
            return true;
        }
    }
    return false;
}

function get_application_context() {
  const ActivityThread = Java.use("android.app.ActivityThread");
  return ActivityThread.currentApplication().getApplicationContext();
}

function R(name, type){
  const context = get_application_context();
  // https://github.com/bitpay/android-sdk/issues/14#issue-202495610
  return context.getResources().getIdentifier(name, type, context.getPackageName());
}

function trim(str, is_global){
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g,"");
    if(is_global){
        result = result.replace(/\s/g,"");
    }
    return result;
}

function dump_object(_this, not_send){
    let class_name = get_real_class_name(_this);
    const clazz = (class_name != '')? Java.use(class_name): null;
    let that = (clazz != null)? Java.cast(_this, clazz): _this;
    let fields = get_fields(that);
    let value = "" + that;
    let ret = {type: "fields", value: value, before: JSON.stringify(fields), class: class_name};
    if(!not_send){
        send(ret);
    }
    return ret;
}

function has_own_property(obj, name) {
    try {
        return obj.hasOwnProperty(name) || name in obj;
    } catch (e) {
        return false;
    }
}

function get_own_property(obj, name) {
    if (!has_own_property(obj, name)) {
        return null;
    }
    let result = null;
    try {
        result = obj[name];
        if (result) {
            return result
        }
    } catch (e) {
    }

    try {
        result = obj.getOwnProperty(name);
        if (result) {
            return result;
        }
    } catch (e) {
    }
    return result
}

function get_class_safe(_this){
    try {
        return _this.getClass().getName();
    } catch (e) {
    }
    return ''
}

//获取字段信息，找到第一个
function get_field_object(_this, field_name){
    if(_this != undefined && _this != null){
        try {
            let cls = _this.getClass();
            while (cls !== null && !cls.equals(Java.use("java.lang.Object").class)) {
                const field_array = cls.getDeclaredFields();
                for (var i = 0; i < field_array.length; i++){
                    let field = field_array[i]; //当前成员
                    field.setAccessible(true);
                    let cur_field_name = field.getName();
                    if(cur_field_name == field_name){
                        return field.get(_this);
                    }
                }
                cls = cls.getSuperclass();
            }
        } catch (e) {
        }
    }
    return null;
}

//获取字段信息，找到所有的
function get_field_object_all(_this, field_name){
    let result = [];
    if(_this != undefined && _this != null){
        try {
            let cls = _this.getClass();
            while (cls !== null && !cls.equals(Java.use("java.lang.Object").class)) {
                const field_array = cls.getDeclaredFields();
                for (var i = 0; i < field_array.length; i++){
                    let field = field_array[i]; //当前成员
                    field.setAccessible(true);
                    let cur_field_name = field.getName();
                    if(cur_field_name == field_name){
                        result.push(field.get(_this));
                    }
                }
                cls = cls.getSuperclass();
            }
        } catch (e) {
        }
    }
    return result;
}

//获取字段信息
function get_fields(_this){
    let fields = {};
    if(_this != undefined && _this != null){
        try {
            let class_name = get_real_class_name(_this);
            const clazz = (class_name != '')? Java.use(class_name): null;
            let that = (clazz != null)? Java.cast(_this, clazz): _this;
            let cls = that.getClass();
            while (cls !== null && !cls.equals(Java.use("java.lang.Object").class)) {
                var field_array = cls.getDeclaredFields();
                for (var i = 0; i < field_array.length; i++){
                    let field = field_array[i]; //当前成员
                    field.setAccessible(true);
                    let field_name = field.getName();
                    let field_class_name = field.getType().getName();
                    let key = '' + cls + '.' + field_name;
                    let field_val = 'UNKNOWN'
                    try {
                        let field_val_obj = field.get(that);
                        field_val = field_val_obj == null? field_val_obj: field_val_obj.toString();
                        if(is_map(field_class_name)){
                            field_val = dump_map(field_val_obj);
                        }else if(is_collection(field_class_name)){
                            field_val = dump_collection(field_val_obj);
                        }
                    }
                    catch(err){
                    }
                    fields[key] = {field: field_name, class: field_class_name, value: field_val};
                }
                cls = cls.getSuperclass();
            }
        } catch (e) {
        }
    }
    return fields;
}

//获取参数
function get_arguments(arg_list, arg_cnt){
    let args = {};
    //获取参数
    for (var idx_arg = 0; idx_arg < arg_cnt; idx_arg++) {
        var class_name = '';
        var fields = {};
        let val = '';
        try {
            class_name = get_real_class_name(arg_list[idx_arg]);
            const clazz = (class_name != '')? Java.use(class_name): null;
            let cur_arg = (clazz != null)? Java.cast(arg_list[idx_arg], clazz): arg_list[idx_arg];
            val = '' + cur_arg;
            if(!is_basic_class(class_name)){
                fields = get_fields(cur_arg);
            }
            if(is_map(class_name)){
                val = dump_map(cur_arg);
            }else if(is_collection(class_name)){
                val = dump_collection(cur_arg);
            }
        } catch (e) {
        }
        args[idx_arg] = {class: class_name, value: val, fields: fields};
    }
    return args;
}

//获取参数
function get_arguments_for_so(arg_list, arg_cnt){
    let args = {};
    //获取参数
    for (var idx_arg = 0; idx_arg < arg_cnt; idx_arg++) {
        args[idx_arg] = '' + arg_list[idx_arg];
    }
    return args;
}

//获取调用栈
function get_stack_trace(){
    return Java.use("java.lang.Thread").currentThread().getStackTrace().toString();
}

function probe_obj_method(_this){
    let class_name = get_real_class_name(_this);
    let method_array = get_methods_safe(class_name);
    let ret_values = [];
    for (let i = 0; i < method_array.length; i++) {
        let cur_method = method_array[i]; //当前方法
        let str_method_name = cur_method.getName(); //当前方法名
        let str_ret_type = '' + cur_method.getReturnType();
        str_ret_type = trim(str_ret_type.replace(/(class|interface)/g, ''));
        let str_param_types = trim('' + cur_method.getParameterTypes());
        if(str_param_types == '' && str_ret_type != 'java.lang.Object'
                && str_ret_type != 'boolean' && str_ret_type.indexOf('$') < 0
                && str_method_name != 'toString'){
            try{
                let ret = '' + eval('_this.' + str_method_name + '()');
                ret_values.push({method: str_method_name, ret: ret});
            } catch (e) {
            }
        }
    }
    return ret_values;
}

function dump_map(map_obj){
    if(map_obj){
        let result = {};
        try {
            const MapClass = Java.use("java.util.Map");
            const EntryClass = Java.use("java.util.Map$Entry");
            let entry_set = MapClass.entrySet.apply(map_obj).iterator();
            while (entry_set && entry_set.hasNext()) {
                const entry = Java.cast(entry_set.next(), EntryClass);
                const key = entry.getKey();
                const value = entry.getValue();
                if (key == null || value == null) {
                    continue
                }
                result["" + key] = "" + value;
            }
        } catch (e) {
            console.error('Exception of dump_map(): '+e)
        }
        return result;
    }else{
        return null;
    }
}

function dump_collection(collection_obj){
    if(collection_obj){
        let result = [];
        try {
            const CollectionClass = Java.use("java.util.Collection");
            const object_array = CollectionClass.toArray.apply(collection_obj);
            object_array.forEach(function (element) {
                const item = dump_object(element, true);
                result.push(item);
            });
        } catch (e) {
            console.error('Exception of dump_collection(): '+e)
        }
        return result;
    }else{
        return null;
    }
}

function dump_set(set_obj){
    if(set_obj){
        let result = [];
        try {
            const SetClass = Java.use("java.util.Set");
            const it = Java.cast(set_obj, SetClass).iterator();
            while (it.hasNext()) {
                const item = dump_object(it.next(), true);
                result.push(item);
            }
        } catch (e) {
            console.error('Exception of dump_set(): '+e)
        }
        return result;
    }else{
        return null;
    }
}


function list_class_core(){
    return wrap_java_perform(() => {
        var classes = []
        Java.enumerateLoadedClasses({
            "onMatch": function (className) {
                classes.push(className);
             },
            "onComplete": function () { }
        });
       return classes;
    });
}

function list_class(){
    list_class_core().then(classes => {
       send_msg(classes);
       return classes;
    })
}

function list_class_loaders(){
    return wrap_java_perform(() => {
      let loaders = [];
      Java.enumerateClassLoaders({
        onMatch: function(l) {
          if (l == null) {
            return
          }
          loaders.push(l.toString());
        },
        onComplete: function() { }
      });

      send_msg(loaders);
      return loaders;
    });
}

function list_activity_classes(not_send) {
    return wrap_java_perform(() => {
      const packageManager = Java.use("android.content.pm.PackageManager");
      const GET_ACTIVITIES = packageManager.GET_ACTIVITIES.value;
      const context = get_application_context();
      var activaties = Array.prototype.concat(context.getPackageManager()
        .getPackageInfo(context.getPackageName(), GET_ACTIVITIES).activities.value.map((activityInfo) => {
          return activityInfo.name.value;
        }),
      );
      if(!not_send){
          send_msg(activaties);
      }
      return activaties;
    });
}

function get_activities() {
    const activityThread = Java.use("android.app.ActivityThread");
    const currentActivityThread = activityThread.currentActivityThread();
    return currentActivityThread.mActivities.value.values().toArray();
}

function list_activities() {
    const activityClientRecord = Java.use("android.app.ActivityThread$ActivityClientRecord");
    const activityRecords = get_activities();
    let currentActivity = null;
    let datas = [];
    for (const i of activityRecords) {
        const activityRecord = Java.cast(i, activityClientRecord);
        datas.push(dump_object(activityRecord, true));
    }
    send_msg(datas);
}

function get_current_activity() {
    const activityThread = Java.use("android.app.ActivityThread");
    const activityClass = Java.use("android.app.Activity");
    const activityClientRecord = Java.use("android.app.ActivityThread$ActivityClientRecord");

    const currentActivityThread = activityThread.currentActivityThread();
    const activityRecords = currentActivityThread.mActivities.value.values().toArray();
    let currentActivity = null;
    for (const i of activityRecords) {
        const activityRecord = Java.cast(i, activityClientRecord);
        if (!activityRecord.paused.value) {
            currentActivity = Java.cast(Java.cast(activityRecord, activityClientRecord).activity.value, activityClass);
            break;
        }
    }
    return currentActivity;
}

function list_current_activity() {
    return wrap_java_perform(() => {
      let activity = null;
      let fragment = null;
      const currentActivity = get_current_activity();
      if (currentActivity) {
        // Discover an active fragment
        const fm = currentActivity.getFragmentManager();
        const curFragment = fm.findFragmentById(R("content_frame", "id"));
        activity = currentActivity.$className;
        fragment = curFragment? curFragment.$className: null;
      }
      let datas = [];
      let ret = {activity: activity, fragment: fragment};
      datas.push(ret);
      let fields = JSON.stringify(get_fields(currentActivity));
      let this_value = '' + currentActivity;
      let class_name = get_real_class_name(currentActivity);
      datas.push({type:"fields", value:this_value, before:fields, after:fields, class:class_name});
      send_msg(datas)
      return ret;
    });
}

function open_scheme_url(url){
    return wrap_java_perform(() => {
        const context = get_application_context();
        const AndroidIntent = Java.use("android.content.Intent");
        const Uri = Java.use("android.net.Uri");
        // Init and launch the intent
        const new_intent = AndroidIntent.$new(ACTION_VIEW, Uri.parse(url));
        // new_intent.setFlags(FLAG_ACTIVITY_NEW_TASK);

        context.startActivity(new_intent);
        console.log(clr_yellow("scheme: ") + clr_cyan(url) + clr_yellow(" successfully asked to open."));
    });
}

/*
* startActivity
* Author: sensepost
* HomePage: https://github.com/sensepost/objection
* */
function start_activity(activity_class){
    // -- Sample Java
    //
    // Intent intent = new Intent(this, DisplayMessageActivity.class);
    // intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    //
    // startActivity(intent);
    return wrap_java_perform(() => {
        const context = get_application_context();

        // Setup a new Intent
        const AndroidIntent = Java.use("android.content.Intent");

        // Get the Activity class's .class
        const NewActivity = Java.use(activity_class).class;

        // Init and launch the intent
        const new_intent = AndroidIntent.$new(context, NewActivity);
        new_intent.setFlags(FLAG_ACTIVITY_NEW_TASK);

        context.startActivity(new_intent);
        console.log(clr_yellow("Activity:") + clr_cyan(activity_class) + clr_yellow(" successfully asked to start."));
    });
}

function close_current_activity(){
    const cur_activity = get_current_activity();
    if(cur_activity){
        cur_activity.finish();
    }
}

function hook_json_parser(keyword){
    var validate_parser = function(_this, class_name, method_name, args){
        if(args.length > 0){
            if(keyword != undefined && keyword != null && keyword != ""){
                var val_str = "" + args[0];
                return val_str.indexOf(keyword) >= 0;
            }else{
                return true;
            }
        }else{
            return false;
        }
    }

    hook_func('com.alibaba.fastjson.JSON', 'parseObject', validate_parser);
    hook_func('com.alibaba.fastjson.JSON', 'parseArray', validate_parser);
    hook_func('com.google.gson.JsonParser', 'parse', validate_parser);
    hook_func('com.google.gson.Gson', 'fromJson', validate_parser);
    hook_func('org.codehaus.jackson.JsonFactory', 'createParser', validate_parser);
    hook_func('net.sf.json.JSONObject', 'fromObject', validate_parser);
    hook_func('net.sf.json.JSONArray', 'fromObject', validate_parser);
    hook_func('org.json.JSONObject', '$init', validate_parser);
    hook_func('org.json.JSONArray', '$init', validate_parser);
}

function list_services() {
    return wrap_java_perform(() => {
      const activityThread = Java.use("android.app.ActivityThread");
      const arrayMap = Java.use("android.util.ArrayMap");
      const packageManager = Java.use("android.content.pm.PackageManager");

      const GET_SERVICES = packageManager.GET_SERVICES.value;

      const currentApplication = activityThread.currentApplication();
      // not using the helper as we need other variables too
      const context = currentApplication.getApplicationContext();

      let services = [];
      currentApplication.mLoadedApk.value.mServices.value.values().toArray().map((potentialServices) => {
        Java.cast(potentialServices, arrayMap).keySet().toArray().map((service) => {
          services.push(service.$className);
        });
      });

      services = services.concat(context.getPackageManager()
        .getPackageInfo(context.getPackageName(), GET_SERVICES).services.value.map((activityInfo) => {
          return activityInfo.name.value;
        }),
      );
      send_msg(services);
      return services;
    });
}

function list_broadcast_receivers() {
    return wrap_java_perform(() => {
      const activityThread = Java.use("android.app.ActivityThread");
      const arrayMap = Java.use("android.util.ArrayMap");
      const packageManager = Java.use("android.content.pm.PackageManager");

      const GET_RECEIVERS = packageManager.GET_RECEIVERS.value;
      const currentApplication = activityThread.currentApplication();
      // not using the helper as we need other variables too
      const context = currentApplication.getApplicationContext();

      let receivers = [];
      currentApplication.mLoadedApk.value.mReceivers.value.values().toArray().map((potentialReceivers) => {
        Java.cast(potentialReceivers, arrayMap).keySet().toArray().map((receiver) => {
          receivers.push(receiver.$className);
        });
      });

      receivers = receivers.concat(context.getPackageManager()
        .getPackageInfo(context.getPackageName(), GET_RECEIVERS).receivers.value.map((activityInfo) => {
          return activityInfo.name.value;
        }),
      );

      send_msg(receivers);
      return receivers;
   });
}

function gen_request_data(request){
    var class_name = get_real_class_name(request);
    if (class_name == "okhttp3.Request" || class_name == "com.android.okhttp.Request") {
        let data = null;
        try{
            var url = request.url().toString();
            var method = request.method();
            var headers = request.headers().toString();
            var requestBody = request.body();
            var body_class = '' ;
            var body = '';
            if(method == 'POST' && requestBody){
                try{
                    body_class = get_real_class_name(requestBody);
                    var Buffer = java_use_safe("okio.Buffer");
                    var ByteString = null;
                    if(Buffer == null){
                        Buffer = java_use_safe("com.android.okhttp.okio.Buffer")
                        ByteString = java_use_safe("com.android.okhttp.okio.ByteString");
                    }else{
                        ByteString = java_use_safe("okio.ByteString");
                    }
                    var BufferObj = Buffer.$new();
                    requestBody.writeTo(BufferObj);
                    try {
                        body = ByteString.of(BufferObj.readByteArray()).utf8();
                    } catch (error) {
//                        console.log(clr_red("error in parsing body - 1: "), error);
                        try {
                            body = ByteString.of(BufferObj.readByteArray()).hex();
                        } catch (error) {
//                            console.log(clr_red("error in parsing body - 2: "), error);
                        }
                    }
                }catch(e){
//                    console.log(clr_red("error in parsing body: "), e);
                }
                if(body == null || body == ''){
                    body = get_fields(requestBody);
                }
            }
            data = {type: "request", request: request.toString(), url: url,
                    method: method, headers: headers, body: {class: body_class, data: body}};
        } catch (error) {
            console.log(clr_red("error in parsing request: "), error);
            data = {type: "request", request: request.toString()};
        }
        return data;
    }else{
        let ret_values = probe_obj_method(request)
        return {type: "request", request: (request != null? request.toString(): "null"),
                probe: JSON.stringify(ret_values), class: class_name};
    }
}

function un_gzip(bytes){
    let ByteArrayInputStream = Java.use('java.io.ByteArrayInputStream');
    const ByteArrayOutputStream = Java.use('java.io.ByteArrayOutputStream');
    const GZIPInputStream = Java.use('java.util.zip.GZIPInputStream');

    let input = ByteArrayInputStream.$new(bytes);
    let out = ByteArrayOutputStream.$new();
    let byte_temp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    try {
        let ungzip = GZIPInputStream.$new(input);
        let buffer = Java.array('B', byte_temp);
        let n;
        while ((n = ungzip.read(buffer, 0, buffer.length)) >= 0) {
            out.write(buffer, 0, n);
        }
    } catch (e) {
        console.error(e);
    }
    return out.toString();
}

function gen_response_data(response){
    var class_name = get_real_class_name(response);
    let data = {type:"response",response:(response!=null?response.toString():"null"), class: class_name};
    if (class_name == "okhttp3.Response" || class_name == "com.android.okhttp.Response") {
        try {
            let headers = response.headers();
            data['headers'] = headers.toString();
            let body = '';
            if(has_method(response, 'body')){
                var responseBody = response.body();
                if(responseBody != null){
                    if(has_method(responseBody, 'string')){
                        body = responseBody.string();
                    }
                    if(body.length == 0 && has_method(responseBody, 'contentLength')
                            && responseBody.contentLength() > 0 && has_method(headers, 'get')){
                        var contentType = headers.get("Content-Type");
                        if (contentType && contentType.indexOf("video") == -1
                                && contentType.indexOf("application/zip") != 0
                                && contentType.indexOf("application") == 0
                                && has_method(responseBody, 'source')) {
                            var source = responseBody.source();
                            if(source){
                                let encoding = headers.get("Content-Encoding");
                                if((!encoding || encoding != 'gzip') && has_method(source, 'readUtf8')){
                                    body = source.readUtf8();
                                }else if(has_method(source, 'readByteString')){
                                    let byte_string = source.readByteString();
                                    if(byte_string){
                                        if(encoding && encoding == 'gzip'){
                                            body = un_gzip(byte_string.toByteArray());
                                        }else{
                                            body = byte_string.hex();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if(body != ''){
                data['body'] = body;
            }
        } catch (error) {
            // console.log("error 2:", error);
        }
    }
    return data;
}

function hook_func_frame(class_name, method_name, func){
    return wrap_java_perform(() => {
        try{
            let is_super = false;
            const ObjectClazz = Java.use("java.lang.Object");
            let cls = Java.use(class_name);
            while (cls !== null && (!is_super || !cls.class.equals(ObjectClazz.class))) {
                if(cls[method_name] != undefined){
                    let full_func_name = cls.class.getName() + '.' + method_name;
                    let n_overload_cnt = cls[method_name].overloads.length;
                    for (let index = 0; index < n_overload_cnt; index++) {
                        cls[method_name].overloads[index].implementation = func;
                        console.log(clr_yellow(clr_blink(full_func_name + "() [" + index +  "] is hooked...")));
                    }
                    return;
                }
                /* 需要再观察
                let super_cls = cls.class.getSuperclass().getName();
                cls = Java.use(super_cls);
                is_super = true; */
                break;
            }
            console.log('error: method ' + method_name + '() not found in class ' + class_name + '!')
        }catch(e){
            console.log(clr_red(class_name + '.' + method_name + '() failed to hook.'))
        }
    });
}

function hook_func(class_name, method_name, validate_func){
    return hook_func_frame(class_name, method_name, function () {
        let ret = null;
        let func_called = false;
        try{
            if(!validate_func || validate_func(this, class_name, method_name, arguments)){
                // console.log(clr_red(clr_blink('enter: ' + class_name + '.' + method_name)));
                var full_func_name = class_name + '.' + method_name + '()';
                // 获取时间戳
                var timestamp = (new Date()).getTime();
                var datas = [];
                datas.push({type:"stack", data:get_stack_trace(), timestamp:timestamp, funcName:full_func_name});
                let args_before = get_arguments(arguments, arguments.length);
                let fields_before = get_fields(this);
                //调用原应用的方法
                ret = this[method_name].apply(this, arguments);
                let this_value = '' + this;
                func_called = true;
                let args_after = get_arguments(arguments, arguments.length);
                let fields_after = get_fields(this);
                let ret_fields = {};
                let ret_class = get_real_class_name(ret);
                if(!is_basic_class(ret_class)){
                    ret_fields = get_fields(ret);
                }
                let ret_value = ret!=null?ret.toString():"null";
                if(is_map(ret_class)){
                    ret_value = dump_map(ret);
                }else if(is_collection(ret_class)){
                    ret_value = dump_collection(ret);
                }
                datas.push({type:"arguments", before:JSON.stringify(args_before), after:JSON.stringify(args_after)});
                datas.push({type:"fields", value:this_value, before:JSON.stringify(fields_before), after:JSON.stringify(fields_after), class:class_name});
                datas.push({type:"return", class:ret_class, value:ret_value, fields:JSON.stringify(ret_fields)});
                send(datas);
            }
        }catch(e){
            console.error('Exception of hook function ' + full_func_name + ': ' + e);
        }
        if(!func_called){
            return this[method_name].apply(this, arguments);
        }else{
            return ret;
        }
    });
}

function detect_func_call(class_name, method_name, validate_func){
    return hook_func_frame(class_name, method_name, function () {
        try{
            if(!validate_func || validate_func(this, class_name, method_name, arguments)){
                var full_func_name = class_name + '.' + method_name + '()';
                // 获取时间戳
                var timestamp = (new Date()).getTime();
                var datas = [];
                datas.push({type:"stack", data:get_stack_trace(), timestamp:timestamp, funcName:full_func_name});
                let args = get_arguments(arguments, arguments.length);
                datas.push({type:"arguments", before:JSON.stringify(args), after:JSON.stringify(args)});
                send(datas);
            }
        }catch(e){
            console.error(e);
        }
        return this[method_name].apply(this, arguments);
    });
}

function hook_class(class_name){
    return wrap_java_perform(() => {
        // hook 构造函数
        hook_func(class_name, "$init");
        //获取类的所有方法
        var method_array = get_methods_safe(class_name);

        //hook 类所有方法 （所有重载方法也要hook)
        let hooked_methods = {};
        for (var i = 0; i < method_array.length; i++){
            let cur_method = method_array[i]; //当前方法
            let str_method_name = cur_method.getName(); //当前方法名
            if (!hooked_methods[str_method_name]){
                hook_func(class_name, str_method_name);
                hooked_methods[str_method_name] = true;
            }
        }
    });
}

function hook_so_func(module_name, func_name, addr_str){
    return wrap_java_perform(() => {
        //对函数名hook
        var ptr_func = func_name != ''?
                        Module.findExportByName(module_name, func_name):
                        new NativePointer(addr_str);
        var full_func_name = module_name + ": " + '[' + ptr_func + '] ' + func_name + '()';
        console.log(clr_yellow(full_func_name + " is hooked..."));
        Interceptor.attach(ptr_func,{
            //onEnter: 进入该函数前要执行的代码，其中args是传入的参数，一般so层函数第一个参数都是JniEnv，第二个参数是jclass，从第三个参数开始是我们java层传入的参数
            onEnter: function(args) {
                var datas = [];
                datas.push({type:"stack", data:get_stack_trace(), funcName:full_func_name});
                let args_list = get_arguments_for_so(args, 4);
                datas.push({type:"asm_args", data:args_list});
                send(datas);
            },
            onLeave: function(ret){ //onLeave: 该函数执行结束要执行的代码，其中ret参数即是返回值
                send({type:"return", value:(ret!=null?ret.toString():"null"), funcName:func_name});
            }
        });
    });
}

function hook_so(module_name){
    return wrap_java_perform(() => {
        var libxx = Process.getModuleByName(module_name);
        var exports = libxx.enumerateExports();
        for(var i = 0; i < exports.length; i++) {
            let ptr_func = new NativePointer(exports[i].address);
            let func_name = module_name + ": " + '[' + ptr_func + '] ' + exports[i].name + '()';
            try {
                Interceptor.attach(ptr_func,{
                    //onEnter: 进入该函数前要执行的代码，其中args是传入的参数，一般so层函数第一个参数都是JniEnv，第二个参数是jclass，从第三个参数开始是我们java层传入的参数
                    onEnter: function(args) {
                        var datas = [];
                        datas.push({type:"stack", data:get_stack_trace(), funcName:func_name});
                        let args_list = get_arguments_for_so(args, 4);
                        datas.push({type:"asm_args", data:args_list});
                        send(datas);
                    },
                    onLeave: function(ret){ //onLeave: 该函数执行结束要执行的代码，其中ret参数即是返回值
                        send({type:"return", value:(ret!=null?ret.toString():"null"), funcName:func_name});
                    }
                });
                console.log(clr_yellow(func_name + " is hooked..."));
            }
            catch(err){
            }
        }
    });
}

function hook_okhttp_execute_core(class_name, method_name){
    return hook_func_frame(class_name, method_name, function(){
        let datas = [];
        var timestamp = (new Date()).getTime();
        let func_name = class_name + "." + method_name + "()";
        datas.push({type:"stack", data:get_stack_trace(), timestamp:timestamp, funcName:func_name});
        var response = this[method_name].apply(this, arguments);
        try{
            var request = null;
            if(class_name == "okhttp3.RealCall"){
                request = this.request();
            }else{
                request = get_field_object(this, 'originalRequest');
            }
            datas.push(gen_request_data(request));
            datas.push(gen_response_data(response));
        }catch(e){
            console.error(e);
        }
        send_msg(datas)
        return response;
    });
}

function hook_okhttp_enqueue_core(class_name, method_name){
    return hook_func_frame(class_name, method_name, function(){
        let datas = [];
        var timestamp = (new Date()).getTime();
        let func_name = class_name + "." + method_name + "()";
        datas.push({type:"stack", data:get_stack_trace(), timestamp:timestamp, funcName:func_name});
        this[method_name].apply(this, arguments);
        try{
            var request = null;
            if(class_name == "okhttp3.RealCall"){
                request = this.request();
            }else{
                request = get_field_object(this, 'originalRequest');
            }
            datas.push(gen_request_data(request));
        }catch(e){
            console.error(e);
        }
        send_msg(datas)
    });
}

function hook_okhttp_execute(){
    return hook_okhttp_execute_core('com.android.okhttp.Call', 'execute');
}

function hook_okhttp3_execute(){
    return hook_okhttp_execute_core('okhttp3.RealCall', 'execute');
}

function hook_okhttp_enqueue(){
    hook_okhttp_enqueue_core("com.android.okhttp.Call", "enqueue");
}

function hook_okhttp3_enqueue(){
    hook_okhttp_enqueue_core("okhttp3.RealCall", "enqueue");
}

function hook_http_url_connection(){
    var class_name = 'com.android.okhttp.internal.huc.HttpURLConnectionImpl';
    var method_name = 'execute';
    return hook_func_frame(class_name, method_name, function(){
        let datas = [];
        var timestamp = (new Date()).getTime();
        let func_name = class_name + "." + method_name + "()";
        datas.push({type:"stack", data:get_stack_trace(), timestamp:timestamp, funcName:func_name});
        try{
            var engine = get_field_object(this, "httpEngine");
            var request = get_field_object(engine, "userRequest");
            var url = "" + get_field_object(request, "url");
            var method = get_field_object(request, "method");
            var headers = "" + get_field_object(request, "headers");
            datas.push({type: "request", url: url, headers: headers, method:method});
        }catch(e){
            console.error("catch an exception in parsing request:", e);
        }
        var ret = this[method_name].apply(this, arguments);
        try{
            var engine = get_field_object(this, "httpEngine");
            var response = get_field_object(engine, "userResponse");
            if(response != null){
                response = this.getResponse().getResponse();
                datas.push(gen_response_data(response));
            }else{
                datas.push({type:"response",response:"null", class: "com.android.okhttp.Response"});
            }
        }catch(e){
            datas.push({type:"response",response:"null", class: "com.android.okhttp.Response"});
        }
        send_msg(datas)
        return ret;
    });
}

function hook_http_execute(){
    hook_http_url_connection();
    hook_okhttp_execute();
    hook_okhttp3_execute();
    hook_okhttp_enqueue();
    hook_okhttp3_enqueue();
}

function hook_okhttp3_CallServer(){
    return wrap_java_perform(() => {
        var InterceptorClass = Java.use("okhttp3.internal.http.CallServerInterceptor");
        InterceptorClass.intercept.implementation=function(chain){
            let datas = [];
            let func_name = "okhttp3.internal.http.CallServerInterceptor.intercept()";
            var timestamp = (new Date()).getTime();
            datas.push({type:"stack", data:get_stack_trace(), timestamp:timestamp, funcName:func_name});
            var request = chain.request();
            var response = this.intercept(chain);
            datas.push(gen_request_data(request));
            datas.push(gen_response_data(response));
            send_msg(datas)
            return response;
        }
        console.log(clr_yellow(clr_blink("okhttp3.internal.http.CallServerInterceptor.intercept() is hooked...")));
    });
}

function hook_intercept(class_name){
    return wrap_java_perform(() => {
        var InterceptorClass = Java.use(class_name);
        InterceptorClass.intercept.implementation=function(chain){
            let datas = [];
            let func_name = class_name + ".intercept()";
            var timestamp = (new Date()).getTime();
            datas.push({type:"stack", data:get_stack_trace(), timestamp:timestamp, funcName:func_name});
            var request = chain.request();
            var response = this.intercept(chain);
            datas.push(gen_request_data(request));
            datas.push(gen_response_data(response));
            send_msg(datas);
            return response;
        }
        console.log(clr_yellow(clr_blink(InterceptorClass + ".intercept() is hooked...")));
    });
}

function okhttp3_get(url, headers_str){
    let body = null;
    Java.perform(() => {
        const BuilderClazz = Java.use('okhttp3.Request$Builder');
        const OkHttpClientClazz = Java.use('okhttp3.OkHttpClient');
        try{
            let builder = BuilderClazz.$new();
            builder = builder.url(url);
            if(headers_str != null && headers_str != ''){
                let headers = JSON.parse(headers_str);
                for(let key in headers){
                    builder = builder.addHeader(key, headers[key]);
                }
            }
            let request = builder.build();
            if(!okhttp3_client){
                okhttp3_client = OkHttpClientClazz.$new();
            }
            let call = okhttp3_client.newCall(request);
            let response = call.execute();
            body = response.body().string();
        }catch(e){
            console.error(e);
        }
    });
    return body;
}

function okhttp3_post(url, headers_str, media_type, body){
    let ret = null;
    Java.perform(() => {
        const BuilderClazz = Java.use('okhttp3.Request$Builder');
        const OkHttpClientClazz = Java.use('okhttp3.OkHttpClient');
        const MediaTypeClazz = Java.use('okhttp3.MediaType');
        const RequestBodyClazz = Java.use('okhttp3.RequestBody');
        try{
            let builder = BuilderClazz.$new();
            builder = builder.url(url);
            if(headers_str != null && headers_str != ''){
                let headers = JSON.parse(headers_str);
                for(let key in headers){
                    builder = builder.addHeader(key, headers[key]);
                }
            }
            let m_type = MediaTypeClazz.parse(media_type);
            let request_body = RequestBodyClazz.create(m_type, body);
            builder = builder.post(request_body);
            let request = builder.build();
            if(!okhttp3_client){
                okhttp3_client = OkHttpClientClazz.$new();
            }
            let call = okhttp3_client.newCall(request);
            let response = call.execute();
            ret = response.body().string();
        }catch(e){
            console.error(e);
        }
    });
    return ret;
}

function dump_so_memory(module_name, offset, length){
    return wrap_java_perform(() => {
        var libc = Module.findBaseAddress(module_name);
        var data = hexdump(libc, {offset: offset, length: length, header: true, ansi: true});
        send_msg(data);
        return data;
    });
}

function dump_memory(addr_str, length){
    return wrap_java_perform(() => {
        var addr = new NativePointer(addr_str);
        var data = hexdump(addr, {offset: 0, length: length, header: true, ansi: true});
        send_msg(data);
        return data;
    });
}

function dump_class(class_name, dump_super){
    return wrap_java_perform(() => {
        //获取类的所有方法
        const Modifier = Java.use("java.lang.reflect.Modifier");
        const ObjectClazz = Java.use("java.lang.Object");
        let msgs = [];
        let cls = Java.use(class_name);
        let is_super = false;
        while (cls !== null && !cls.class.equals(ObjectClazz.class)) {
            let cur_class = '' + cls.class.getName();
            if(is_super){
                msgs.push(clr_bright_green("------------  [")+clr_purple("S")+clr_bright_green("] "+cur_class+"  ------------"));
            }else{
                msgs.push(clr_bright_green("------------  " + class_name + "  ------------"));
            }
            //获取类的所有字段
            let field_array = cls.class.getDeclaredFields();
            for (let i = 0; i < field_array.length; i++) {
                let field = field_array[i]; //当前成员
                let field_name = field.getName();
                let field_class = field.getType().getName();
                let modifier = '' + Modifier.toString(field.getModifiers());
                msgs.push("  "+ clr_cyan(modifier) + " " + clr_blue(field_class) + " " + clr_purple(field_name));
            }
            //hook 类所有方法 （所有重载方法也要hook)
            let method_array = cls.class.getDeclaredMethods();
            for (let i = 0; i < method_array.length; i++) {
                let cur_method = method_array[i]; //当前方法
                let str_method_name = cur_method.getName(); //当前方法名
                let modifier = '' + Modifier.toString(cur_method.getModifiers());
                let str_ret_type = ' ' + cur_method.getReturnType();
                str_ret_type = str_ret_type.replace(/(class|interface)/g, '')
                let str_param_types = ('' + cur_method.getParameterTypes()).split(',');
                let fmt_param_types = []
                for (let j = 0; j < str_param_types.length; j++){
                    fmt_param_types.push(clr_bright_blue(str_param_types[j].replace(/(class|interface| )/g, '')))
                }
                msgs.push("  " + clr_cyan(modifier) + clr_yellow(str_ret_type) + " " + clr_bright_purple(str_method_name)
                    + clr_dark_gray("(") + fmt_param_types.join(clr_dark_gray(",")) + clr_dark_gray(")"));
            }
            if(dump_super){
                let super_cls = cls.class.getSuperclass().getName();
                cls = Java.use(super_cls);
                is_super = true;
            }else{
                break;
            }
        }
        send(msgs.join("\n"));
    });
}
function list_so(){
    return wrap_java_perform(() => {
        var msgs = []
        var datas = [];
        Process.enumerateModules({
            onMatch: function(module){
                msgs.push('    ' + clr_yellow(module.name) + "\t" + module.base + "\t"+ module.size + "\t" + clr_bright_blue(clr_underline(module.path)));
                datas.push(module)
            },
           onComplete: function(){ }
        });
        send_msg(msgs.join("\n"));
        return datas;
    });
}
function dump_so(module_name, file_path){
    return wrap_java_perform(() => {
        var libxx = Process.getModuleByName(module_name);
        var file_handle = new File(file_path, "wb");
        if (file_handle && file_handle != null) {
            Memory.protect(ptr(libxx.base), libxx.size, 'rwx');
            var libso_buffer = ptr(libxx.base).readByteArray(libxx.size);
            file_handle.write(libso_buffer);
            file_handle.flush();
            file_handle.close();
            console.log("dump finished!\noutput: " + clr_bright_blue(clr_underline(file_path)));
        }else{
            console.log("failed to dump " + module_name + " to file - " + file_path);
        }
    });
}
function find_so(module_name){
    try {
        var libxx = Process.getModuleByName(module_name);
        return {base: libxx.base, size: libxx.size};
    }
    catch(err){
        console.log(err);
    }
}
function list_so_func(module_name){
    return wrap_java_perform(() => {
        var datas = [];
        var libxx = Process.getModuleByName(module_name);
        datas.push(clr_bright_green("--------------------------  " + libxx.name + "  --------------------------"));
        datas.push("    "+clr_bright_gray(clr_reverse("name"))+": " + clr_cyan(libxx.name));
        datas.push("    "+clr_bright_gray(clr_reverse("base"))+": " + clr_cyan(libxx.base));
        datas.push("    "+clr_bright_gray(clr_reverse("size"))+": " + clr_cyan(ptr(libxx.size)));
        datas.push(clr_bright_green("--------------------------  exports  --------------------------"));
        datas.push("    "+clr_bright_gray(clr_reverse("address\toffset\tfunction")));

        var exports = libxx.enumerateExports();
        for(var i = 0; i < exports.length; i++) {
            datas.push("    "+exports[i].address+"\t"+ptr(exports[i].address-libxx.base)+"\t"+clr_cyan(exports[i].name));
        }

        datas.push(clr_bright_green("--------------------------  imports  --------------------------"));
        datas.push("    "+clr_bright_gray(clr_reverse("address\tmodule\t\t\tfunction")));
        var imports =  libxx.enumerateImports();
        for(var i = 0; i < imports.length; i++) {
            datas.push("    "+imports[i].address+"\t"+clr_bright_blue(clr_underline(imports[i].module))+"\t"+clr_cyan(imports[i].name));
         }
        /* 暂时没有发现实用价值，先注释掉 by Ryan
        datas.push(clr_bright_green("--------------------------  symbols  --------------------------"));
        datas.push("    "+clr_bright_gray(clr_reverse("address\ttype\tname\tis_global\tsection")));
        var symbols = libxx.enumerateSymbols();
        for(var i = 0; i < symbols.length; i++) {
            datas.push("    "+symbols[i].address+"\t"+symbols[i].type+"\t"+symbols[i].name+"\t"+symbols[i].isGlobal+"\t"+JSON.stringify(symbols[i].section));
        }
        */
        send(datas.join("\n"));
        return {module: libxx, exports: exports, imports: imports}
    });
}
function list_thread(){
    return wrap_java_perform(() => {
        var enumerateThreads =  Process.enumerateThreads();
        for(var i = 0; i < enumerateThreads.length; i++) {
            console.log("");
            console.log("id:",enumerateThreads[i].id);
            console.log("state:",enumerateThreads[i].state);
            console.log("context:",JSON.stringify(enumerateThreads[i].context));
        }
        return enumerateThreads;
    });
}
function search_in_memory(module_name, pattern){
    //pattern 是搜索条件，如 "03 49 ?? 50 20 44"，其中 "??" 是通配符
    return wrap_java_perform(() => {
        var libxx = Process.getModuleByName(module_name);
        console.log("base:"+libxx.base)
        //从so的基址开始搜索，搜索大小为so文件的大小，搜指定条件03 49 ?? 50 20 44的数据
        var res = Memory.scan(libxx.base, libxx.size, pattern, {
            onMatch: function(address, size){ //搜索成功
                console.log('搜索到 ' +pattern +" 地址是:"+ address.toString());
            },
            onError: function(reason){ //搜索失败
                console.log('搜索失败');
            },
            onComplete: function(){ //搜索完毕
                console.log("搜索完毕")
            }
          });
    });
}
/*
* dump_dex
* Author: hluwa <hluwa888@gmail.com>
* HomePage: https://github.com/hluwa
* CreatedTime: 2020/1/7 20:44
* */
function verify_by_maps(dexptr, mapsptr) {
    var maps_offset = dexptr.add(0x34).readUInt();
    var maps_size = mapsptr.readUInt();
    for (var i = 0; i < maps_size; i++) {
        var item_type = mapsptr.add(4 + i * 0xC).readU16();
        if (item_type === 4096) {
            var map_offset = mapsptr.add(4 + i * 0xC + 8).readUInt();
            if (maps_offset === map_offset) {
                return true;
            }
        }
    }
    return false;
}
function get_dex_real_size(dexptr, range_base, range_end) {
    var dex_size = dexptr.add(0x20).readUInt();
    var maps_address = get_maps_address(dexptr, range_base, range_end);
    if (!maps_address) {
        return dex_size;
    }
    var maps_end = get_maps_end(maps_address, range_base, range_end);
    if (!maps_end) {
        return dex_size;
    }
    return maps_end - dexptr
}
function get_maps_address(dexptr, range_base, range_end) {
    var maps_offset = dexptr.add(0x34).readUInt();
    if (maps_offset === 0) {
        return null;
    }
    var maps_address = dexptr.add(maps_offset);
    if (maps_address < range_base || maps_address > range_end) {
        return null;
    }
    return maps_address;
}
function get_maps_end(maps, range_base, range_end) {
    var maps_size = maps.readUInt();
    if (maps_size < 2 || maps_size > 50) {
        return null;
    }
    var maps_end = maps.add(maps_size * 0xC + 4);
    if (maps_end < range_base || maps_end > range_end) {
        return null;
    }

    return maps_end;
}
function verify(dexptr, range, enable_verify_maps) {
    if (range != null) {
        var range_end = range.base.add(range.size);
        // verify header_size
        if (dexptr.add(0x70) > range_end) {
            return false;
        }
        // In runtime, the fileSize is can to be clean, so it's not trust.
        // verify file_size
        // var dex_size = dexptr.add(0x20).readUInt();
        // if (dexptr.add(dex_size) > range_end) {
        //     return false;
        // }
        if (enable_verify_maps) {
            var maps_address = get_maps_address(dexptr, range.base, range_end);
            if (!maps_address) {
                return false;
            }
            var maps_end = get_maps_end(maps_address, range.base, range_end);
            if (!maps_end) {
                return false;
            }
            return verify_by_maps(dexptr, maps_address)
        } else {
            return dexptr.add(0x3C).readUInt() === 0x70;
        }
    }
    return false;
}
function memory_dump(address, size) {
    Memory.protect(ptr(address), size, 'rwx');
    return ptr(address).readByteArray(size);
//    return new NativePointer(address).readByteArray(size);
}
function scan_dex(enable_deep_search) {
    if(dex_list.length > 0){
        return dex_list;
    }
    var result = [];
    Process.enumerateRanges('r--').forEach(function (range) {
        try {
            Memory.scanSync(range.base, range.size, "64 65 78 0a 30 ?? ?? 00").forEach(function (match) {

                if (range.file && range.file.path
                    && (// range.file.path.startsWith("/data/app/") ||
                        range.file.path.startsWith("/data/dalvik-cache/") ||
                        range.file.path.startsWith("/system/"))) {
                    return;
                }

                if (verify(match.address, range, false)) {
                    var dex_size = get_dex_real_size(match.address, range.base, range.base.add(range.size));
                    result.push({
                        "addr": match.address,
                        "size": dex_size
                    });

                    var max_size = range.size - match.address.sub(range.base);
                    if (enable_deep_search && max_size != dex_size) {
                        result.push({
                            "addr": match.address,
                            "size": max_size
                        });
                    }
                }
            });

            if (enable_deep_search) {
                Memory.scanSync(range.base, range.size, "70 00 00 00").forEach(function (match) {
                    var dex_base = match.address.sub(0x3C);
                    if (dex_base < range.base) {
                        return
                    }
                    if (dex_base.readCString(4) != "dex\n" && verify(dex_base, range, true)) {
                        var real_dex_size = get_dex_real_size(dex_base, range.base, range.base.add(range.size));
                        result.push({
                            "addr": dex_base,
                            "size": real_dex_size
                        });
                        var max_size = range.size - dex_base.sub(range.base);
                        if (max_size != real_dex_size) {
                            result.push({
                                "addr": match.address,
                                "size": max_size
                            });
                        }
                    }
                })
            } else {
                if (range.base.readCString(4) != "dex\n" && verify(range.base, range, true)) {
                    var real_dex_size = get_dex_real_size(range.base, range.base, range.base.add(range.size));
                    result.push({
                        "addr": range.base,
                        "size": real_dex_size
                    });
                }
            }

        } catch (e) {
        }
    });

    return result;
}
function search_class(keyword){
    let pattern = new RegExp(keyword, 'i');
    return wrap_java_perform(() => {
        list_class_core().then(class_names => {
            var msgs = [];
            var clazz = [];
            class_names.forEach((class_name) =>{
                if(class_name.match(pattern)){
                    msgs.push(clr_purple(class_name));
                    clazz.push(class_name)
                }
            })
            send(msgs.join("\n"));
            return {classes: clazz}
        }).catch(function(error){
        })
    });
}

function search_func_core(method_name, exclude, is_exact){
    let pattern = new RegExp(method_name, 'i');
    let Modifier = Java.use("java.lang.reflect.Modifier");
    let exclude_classes = {}
    let exclude_class_array = exclude.split(',');
    exclude_class_array.forEach(item => {
        exclude_classes[item.trim()] = true;
    })
    return wrap_java_perform(() => {
        list_class_core().then(class_names => {
            var msgs = [];
            var methods = [];
            for (let m = 0; m < class_names.length; m++) {
                let class_name = class_names[m];
                try{
                    console.log(clr_cyan((m + 1) + '/' + class_names.length), clr_purple(class_name));
                    if(exclude_classes[class_name]){
                        continue;
                    }
                    let cls = java_use_safe(class_name);
                    if(is_exact && (!cls || !cls[method_name] || !cls[method_name].overloads
                            || cls[method_name].overloads.length == 0)){
                        continue;
                    }
                    let method_array = get_methods_safe(class_name);
                    for (let i = 0; i < method_array.length; i++) {
                        let cur_method = method_array[i]; //当前方法
                        let str_method_name = cur_method.getName(); //当前方法名
                        if((is_exact && str_method_name == method_name)
                                || (!is_exact && str_method_name.match(pattern))){
                            let modifier = '' + Modifier.toString(cur_method.getModifiers());
                            let str_ret_type = ' ' + cur_method.getReturnType();
                            str_ret_type = str_ret_type.replace(/(class|interface)/g, '')
                            let str_param_types = ('' + cur_method.getParameterTypes()).split(',');
                            let fmt_param_types = []
                            for (let j = 0; j < str_param_types.length; j++){
                                fmt_param_types.push(clr_bright_blue(str_param_types[j].replace(/(class|interface| )/g, '')))
                            }
                            msgs.push(clr_purple(class_name) + "\t" + clr_cyan(modifier) + clr_yellow(str_ret_type) + " " + clr_bright_purple(str_method_name)
                                + clr_dark_gray("(") + fmt_param_types.join(clr_dark_gray(",")) + clr_dark_gray(")"));
                            methods.push({className: class_name, name: str_method_name, modifier: modifier, returnType: str_ret_type, parameterTypes: str_param_types.join(",")})
                        }
                    }
                } catch (e) {
//                    console.log(class_name, e);
                }
            }
            console.log(clr_green("-------------------------- search result -------------------------"));
            send(msgs.join('\n'));
            return {keyword: keyword, methods: methods}
        }).catch(function(error){
        })
    });
}

function search_func(method_name, exclude){
    return search_func_core(method_name, exclude, true);
}

function fuzzy_search_func(keyword, exclude){
    return search_func_core(keyword, exclude, false);
}

function search_return_core(ret_class, exclude, is_exact){
    let pattern = new RegExp(ret_class, 'i');
    let Modifier = Java.use("java.lang.reflect.Modifier");
    let exclude_classes = {}
    let exclude_class_array = exclude.split(',');
    exclude_class_array.forEach(item => {
        exclude_classes[item] = true;
    })
    return wrap_java_perform(() => {
        list_class_core().then(class_names => {
            var msgs = [];
            var methods = [];
            for (let m = 0; m < class_names.length; m++) {
                let class_name = class_names[m];
                try{
                    console.log(clr_cyan((m + 1) + '/' + class_names.length), clr_purple(class_name));
                    if(exclude_classes[class_name]){
                        continue;
                    }
                    let method_array = get_methods_safe(class_name);
                    for (let i = 0; i < method_array.length; i++) {
                        let cur_method = method_array[i]; //当前方法
                        let str_method_name = cur_method.getName(); //当前方法名
                        let str_ret_type = ' ' + cur_method.getReturnType();
                        str_ret_type = str_ret_type.replace(/(class|interface)/g, '')
                        if((is_exact && trim(str_ret_type, true) == ret_class)
                                || (!is_exact && str_ret_type.match(pattern))){
                            let modifier = '' + Modifier.toString(cur_method.getModifiers());
                            let str_param_types = ('' + cur_method.getParameterTypes()).split(',');
                            let fmt_param_types = []
                            for (let j = 0; j < str_param_types.length; j++){
                                fmt_param_types.push(clr_bright_blue(str_param_types[j].replace(/(class|interface| )/g, '')))
                            }
                            msgs.push(clr_purple(class_name) + "\t" + clr_cyan(modifier) + clr_yellow(str_ret_type) + " " + clr_bright_purple(str_method_name)
                                + clr_dark_gray("(") + fmt_param_types.join(clr_dark_gray(",")) + clr_dark_gray(")"));
                            methods.push({className: class_name, name: str_method_name, modifier: modifier, returnType: str_ret_type, parameterTypes: str_param_types.join(",")})
                        }
                    }
                } catch (e) {
//                    console.log(class_name, e);
                }
            }
            console.log(clr_green("-------------------------- search result -------------------------"));
            send(msgs.join('\n'));
            return {returnType: ret_class, methods: methods}
        }).catch(function(error){
        })
    });
}

function search_return(ret_class, exclude){
    return search_return_core(ret_class, exclude, false);
}

function search_instance(class_name){
    return wrap_java_perform(() => {
        Java.choose(class_name, {
            onMatch: function(instance){
                dump_object(instance);
            },
            onComplete: function(){
                console.log("search finished!");
            }
        });
    });
}

function load_all_class() {
    return wrap_java_perform(() => {
        var DexFileclass = Java.use("dalvik.system.DexFile");
        var BaseDexClassLoaderclass = Java.use("dalvik.system.BaseDexClassLoader");
        var DexPathListclass = Java.use("dalvik.system.DexPathList");
        var total_class = 0;

        Java.enumerateClassLoaders({
            onMatch: function (loader) {
                try {
                    console.log(loader);
                    var basedexclassloaderobj = Java.cast(loader, BaseDexClassLoaderclass);
                    var pathList = basedexclassloaderobj.pathList.value;
                    var pathListobj = Java.cast(pathList, DexPathListclass)
                    var dexElements = pathListobj.dexElements.value;
                    for (var index in dexElements) {
                        var element = dexElements[index];
                        try {
                            var dexfile = element.dexFile.value;
                            var dexfileobj = Java.cast(dexfile, DexFileclass);
                            console.log("dexFile:", dexfileobj);
                            const classNames = [];
                            const enumeratorClassNames = dexfileobj.entries();
                            while (enumeratorClassNames.hasMoreElements()) {
                                var className = enumeratorClassNames.nextElement().toString();
                                classNames.push(className);
                                try {
                                    loader.loadClass(className);
                                    total_class++;
                                } catch (error) {
                                    console.log(clr_red("loadClass error: "), clr_red(error));
                                }
                            }
                        } catch (error) {
                            // console.log(clr_red("dexfile error: "), clr_red(error));
                        }
                    }
                } catch (error) {
                    // console.log(clr_red("loader error: "), clr_red(error));
                }
            },
            onComplete: function () {

            }
        })
        console.log("total of", clr_cyan(total_class), " classes were loaded.");
    });
}

/*
* dump_dex
* Author: lasting-yang
* HomePage: https://github.com/lasting-yang/frida_dump
* */
function hook_lib_art() {
    var libart = Process.findModuleByName("libart.so");
    var symbols = libart.enumerateSymbols();
    var addr_DefineClass = null;
    var addr_RegisterNatives = null;
    for (var index = 0; index < symbols.length; index++) {
        var symbol = symbols[index];
        var symbol_name = symbol.name;
        //这个DefineClass的函数签名是Android9的
        //_ZN3art11ClassLinker11DefineClassEPNS_6ThreadEPKcmNS_6HandleINS_6mirror11ClassLoaderEEERKNS_7DexFileERKNS9_8ClassDefE
        if (symbol_name.indexOf("ClassLinker") >= 0 &&
            symbol_name.indexOf("DefineClass") >= 0 &&
            symbol_name.indexOf("Thread") >= 0 &&
            symbol_name.indexOf("DexFile") >= 0) {
//            console.log(symbol_name, symbol.address);
            addr_DefineClass = symbol.address;
        }
        //_ZN3art3JNI15RegisterNativesEP7_JNIEnvP7_jclassPK15JNINativeMethodi
        if (symbol.name.indexOf("art") >= 0 &&
                symbol.name.indexOf("JNI") >= 0 &&
                symbol.name.indexOf("RegisterNatives") >= 0 &&
                symbol.name.indexOf("CheckJNI") < 0) {
            addr_RegisterNatives = symbol.address;
        }
    }
    var dex_maps = {};
    if (addr_DefineClass) {
        console.log("[DefineClass:]", clr_cyan(addr_DefineClass));
        Interceptor.attach(addr_DefineClass, {
            onEnter: function(args) {
                var dex_file = args[5];
                //ptr(dex_file).add(Process.pointerSize) is "const uint8_t* const begin_;"
                //ptr(dex_file).add(Process.pointerSize + Process.pointerSize) is "const size_t size_;"
                var base = ptr(dex_file).add(Process.pointerSize).readPointer();
                var size = ptr(dex_file).add(Process.pointerSize + Process.pointerSize).readUInt();
                if (dex_maps[base] == undefined) {
                    dex_maps[base] = size;
                    var magic = ptr(base).readCString();
                    if (magic.indexOf("dex") == 0) {
                        dex_list.push({"addr": base, "size": size});
                    }
                }
            },
            onLeave: function(retval) {}
        });
    }
    if (addr_RegisterNatives != null) {
        console.log("[RegisterNatives:]", clr_cyan(addr_RegisterNatives));
        Interceptor.attach(addr_RegisterNatives, {
            onEnter: function (args) {
                var env = args[0];
                var java_class = args[1];
                var class_name = Java.vm.tryGetEnv().getClassName(java_class);
                var methods_ptr = ptr(args[2]);
                var method_count = parseInt(args[3]);
                var methods = [];
                for (var i = 0; i < method_count; i++) {
                    var name_ptr = Memory.readPointer(methods_ptr.add(i * Process.pointerSize * 3));
                    var sig_ptr = Memory.readPointer(methods_ptr.add(i * Process.pointerSize * 3 + Process.pointerSize));
                    var fnPtr_ptr = Memory.readPointer(methods_ptr.add(i * Process.pointerSize * 3 + Process.pointerSize * 2));
                    var name = Memory.readCString(name_ptr);
                    var sig = Memory.readCString(sig_ptr);
                    var find_module = Process.findModuleByAddress(fnPtr_ptr);
                    var module_name = find_module? find_module.name: 'Unknown';
                    var offset = find_module? ptr(fnPtr_ptr).sub(find_module.base): '';
                    var method_info = {java_class: class_name, name: name, sig: sig, fnPtr: fnPtr_ptr,
                                        module_name: module_name, offset: offset};
                    methods.push(method_info);
                }
                native_list.push({type:"registerNatives", methods:JSON.stringify(methods)});
            },
            onLeave: function(retval) {}
        });
    }
}

function list_register_natives(){
    send_msg(native_list);
    return native_list;
}

/*
* frida-android-unpinning
* Author: httptoolkit
* HomePage: https://github.com/httptoolkit/frida-android-unpinning
* */
function ssl_unpinning(){
    return wrap_java_perform(() => {
        let datas = [];

        // HttpsURLConnection
        try {
            const HttpsURLConnection = Java.use("javax.net.ssl.HttpsURLConnection");
            HttpsURLConnection.setDefaultHostnameVerifier.implementation = function (hostnameVerifier) {
                send_msg({type: 'action', data:'Bypassing HttpsURLConnection (setDefaultHostnameVerifier)'});
                return; // Do nothing, i.e. don't change the hostname verifier
            };
            datas.push(clr_yellow('[+] HttpsURLConnection (setDefaultHostnameVerifier)'));
        } catch (err) {
            datas.push('[ ] HttpsURLConnection (setDefaultHostnameVerifier)');
        }
        try {
            const HttpsURLConnection = Java.use("javax.net.ssl.HttpsURLConnection");
            HttpsURLConnection.setSSLSocketFactory.implementation = function (SSLSocketFactory) {
                send_msg({type: 'action', data:'Bypassing HttpsURLConnection (setSSLSocketFactory)'});
                return; // Do nothing, i.e. don't change the SSL socket factory
            };
            datas.push(clr_yellow('[+] HttpsURLConnection (setSSLSocketFactory)'));
        } catch (err) {
            datas.push('[ ] HttpsURLConnection (setSSLSocketFactory)');
        }
        try {
            const HttpsURLConnection = Java.use("javax.net.ssl.HttpsURLConnection");
            HttpsURLConnection.setHostnameVerifier.implementation = function (hostnameVerifier) {
                send_msg({type: 'action', data:'Bypassing HttpsURLConnection (setHostnameVerifier)'});
                return; // Do nothing, i.e. don't change the hostname verifier
            };
            datas.push(clr_yellow('[+] HttpsURLConnection (setHostnameVerifier)'));
        } catch (err) {
            datas.push('[ ] HttpsURLConnection (setHostnameVerifier)');
        }

        // SSLContext
        try {
            const X509TrustManager = Java.use('javax.net.ssl.X509TrustManager');
            const SSLContext = Java.use('javax.net.ssl.SSLContext');

            const TrustManager = Java.registerClass({
                // Implement a custom TrustManager
                name: 'dev.asd.test.TrustManager',
                implements: [X509TrustManager],
                methods: {
                    checkClientTrusted: function (chain, authType) { },
                    checkServerTrusted: function (chain, authType) { },
                    getAcceptedIssuers: function () { return []; }
                }
            });

            // Prepare the TrustManager array to pass to SSLContext.init()
            const TrustManagers = [TrustManager.$new()];

            // Get a handle on the init() on the SSLContext class
            const SSLContext_init = SSLContext.init.overload(
                '[Ljavax.net.ssl.KeyManager;', '[Ljavax.net.ssl.TrustManager;', 'java.security.SecureRandom'
            );

            // Override the init method, specifying the custom TrustManager
            SSLContext_init.implementation = function (keyManager, trustManager, secureRandom) {
                send_msg({type: 'action', data:'Bypassing Trustmanager (Android < 7) request'});
                SSLContext_init.call(this, keyManager, TrustManagers, secureRandom);
            };
            datas.push(clr_yellow('[+] SSLContext'));
        } catch (err) {
            datas.push('[ ] SSLContext');
        }

        // TrustManagerImpl (Android > 7)
        try {
            const array_list = Java.use("java.util.ArrayList");
            const TrustManagerImpl = Java.use('com.android.org.conscrypt.TrustManagerImpl');

            // This step is notably what defeats the most common case: network security config
            TrustManagerImpl.checkTrustedRecursive.implementation = function(a1, a2, a3, a4, a5, a6) {
                send_msg({type: 'action', data:'Bypassing TrustManagerImpl checkTrusted '});
                return array_list.$new();
            }

            TrustManagerImpl.verifyChain.implementation = function (untrustedChain, trustAnchorChain, host, clientAuth, ocspData, tlsSctData) {
                send_msg({type: 'action', data:('Bypassing TrustManagerImpl verifyChain: ' + host)});
                return untrustedChain;
            };
            datas.push(clr_yellow('[+] TrustManagerImpl'));
        } catch (err) {
            datas.push('[ ] TrustManagerImpl');
        }

        // OkHTTPv3 (quadruple bypass)
        try {
            // Bypass OkHTTPv3 {1}
            const okhttp3_Activity_1 = Java.use('okhttp3.CertificatePinner');
            okhttp3_Activity_1.check.overload('java.lang.String', 'java.util.List').implementation = function (a, b) {
                send_msg({type: 'action', data:('Bypassing OkHTTPv3 (list): ' + a)});
            };
            datas.push(clr_yellow('[+] OkHTTPv3 (list)'));
        } catch (err) {
            datas.push('[ ] OkHTTPv3 (list)');
        }
        try {
            // Bypass OkHTTPv3 {2}
            // This method of CertificatePinner.check could be found in some old Android app
            const okhttp3_Activity_2 = Java.use('okhttp3.CertificatePinner');
            okhttp3_Activity_2.check.overload('java.lang.String', 'java.security.cert.Certificate').implementation = function (a, b) {
                send_msg({type: 'action', data:('Bypassing OkHTTPv3 (cert): ' + a)});
            };
            datas.push(clr_yellow('[+] OkHTTPv3 (cert)'));
        } catch (err) {
            datas.push('[ ] OkHTTPv3 (cert)');
        }
        try {
            // Bypass OkHTTPv3 {3}
            const okhttp3_Activity_3 = Java.use('okhttp3.CertificatePinner');
            okhttp3_Activity_3.check.overload('java.lang.String', '[Ljava.security.cert.Certificate;').implementation = function (a, b) {
                send_msg({type: 'action', data:('Bypassing OkHTTPv3 (cert array): ' + a)});
            };
            datas.push(clr_yellow('[+] OkHTTPv3 (cert array)'));
        } catch (err) {
            datas.push('[ ] OkHTTPv3 (cert array)');
        }
        try {
            // Bypass OkHTTPv3 {4}
            const okhttp3_Activity_4 = Java.use('okhttp3.CertificatePinner');
            okhttp3_Activity_4['check$okhttp'].implementation = function (a, b) {
                send_msg({type: 'action', data:('Bypassing OkHTTPv3 ($okhttp): ' + a)});
            };
            datas.push(clr_yellow('[+] OkHTTPv3 ($okhttp)'));
        } catch (err) {
            datas.push('[ ] OkHTTPv3 ($okhttp)');
        }

        // Trustkit (triple bypass)
        try {
            // Bypass Trustkit {1}
            const trustkit_Activity_1 = Java.use('com.datatheorem.android.trustkit.pinning.OkHostnameVerifier');
            trustkit_Activity_1.verify.overload('java.lang.String', 'javax.net.ssl.SSLSession').implementation = function (a, b) {
                send_msg({type: 'action', data:('Bypassing Trustkit OkHostnameVerifier(SSLSession): ' + a)});
                return true;
            };
            trustkit_Activity_1.verify.overload('java.lang.String', 'java.security.cert.X509Certificate').implementation = function(a) {
                send_msg({type: 'action', data:('Bypassing Trustkit OkHostnameVerifier(X509Certificate): ' + a)});
                return true;
            };

            datas.push(clr_yellow('[+] Trustkit OkHostnameVerifier(SSLSession)'));
        } catch (err) {
            datas.push('[ ] Trustkit OkHostnameVerifier(SSLSession)');
        }
        try {
            // Bypass Trustkit {2}
            const trustkit_Activity_2 = Java.use('com.datatheorem.android.trustkit.pinning.OkHostnameVerifier');
            trustkit_Activity_2.verify.overload('java.lang.String', 'java.security.cert.X509Certificate').implementation = function (a, b) {
                send_msg({type: 'action', data:('Bypassing Trustkit OkHostnameVerifier(cert): ' + a)});
                return true;
            };
            datas.push(clr_yellow('[+] Trustkit OkHostnameVerifier(cert)'));
        } catch (err) {
            datas.push('[ ] Trustkit OkHostnameVerifier(cert)');
        }
        try {
            // Bypass Trustkit {3}
            const trustkit_PinningTrustManager = Java.use('com.datatheorem.android.trustkit.pinning.PinningTrustManager');
            trustkit_PinningTrustManager.checkServerTrusted.implementation = function () {
                send_msg({type: 'action', data:'Bypassing Trustkit PinningTrustManager'});
            };
            datas.push(clr_yellow('[+] Trustkit PinningTrustManager'));
        } catch (err) {
            datas.push('[ ] Trustkit PinningTrustManager');
        }

        // Appcelerator Titanium
        try {
            const appcelerator_PinningTrustManager = Java.use('appcelerator.https.PinningTrustManager');
            appcelerator_PinningTrustManager.checkServerTrusted.implementation = function () {
                send_msg({type: 'action', data:'Bypassing Appcelerator PinningTrustManager'});
            };
            datas.push(clr_yellow('[+] Appcelerator PinningTrustManager'));
        } catch (err) {
            datas.push('[ ] Appcelerator PinningTrustManager');
        }

        // OpenSSLSocketImpl Conscrypt
        try {
            const OpenSSLSocketImpl = Java.use('com.android.org.conscrypt.OpenSSLSocketImpl');
            OpenSSLSocketImpl.verifyCertificateChain.implementation = function (certRefs, authMethod) {
                send_msg({type: 'action', data:'Bypassing OpenSSLSocketImpl Conscrypt'});
            };
            datas.push(clr_yellow('[+] OpenSSLSocketImpl Conscrypt'));
        } catch (err) {
            datas.push('[ ] OpenSSLSocketImpl Conscrypt');
        }

        // OpenSSLEngineSocketImpl Conscrypt
        try {
            const OpenSSLEngineSocketImpl_Activity = Java.use('com.android.org.conscrypt.OpenSSLEngineSocketImpl');
            OpenSSLEngineSocketImpl_Activity.verifyCertificateChain.overload('[Ljava.lang.Long;', 'java.lang.String').implementation = function (a, b) {
                send_msg({type: 'action', data:('Bypassing OpenSSLEngineSocketImpl Conscrypt: ' + b)});
            };
            datas.push(clr_yellow('[+] OpenSSLEngineSocketImpl Conscrypt'));
        } catch (err) {
            datas.push('[ ] OpenSSLEngineSocketImpl Conscrypt');
        }

        // OpenSSLSocketImpl Apache Harmony
        try {
            const OpenSSLSocketImpl_Harmony = Java.use('org.apache.harmony.xnet.provider.jsse.OpenSSLSocketImpl');
            OpenSSLSocketImpl_Harmony.verifyCertificateChain.implementation = function (asn1DerEncodedCertificateChain, authMethod) {
                send_msg({type: 'action', data:'Bypassing OpenSSLSocketImpl Apache Harmony'});
            };
            datas.push(clr_yellow('[+] OpenSSLSocketImpl Apache Harmony'));
        } catch (err) {
            datas.push('[ ] OpenSSLSocketImpl Apache Harmony');
        }

        // PhoneGap sslCertificateChecker (https://github.com/EddyVerbruggen/SSLCertificateChecker-PhoneGap-Plugin)
        try {
            const phonegap_Activity = Java.use('nl.xservices.plugins.sslCertificateChecker');
            phonegap_Activity.execute.overload('java.lang.String', 'org.json.JSONArray', 'org.apache.cordova.CallbackContext').implementation = function (a, b, c) {
                send_msg({type: 'action', data:('Bypassing PhoneGap sslCertificateChecker: ' + a)});
                return true;
            };
            datas.push(clr_yellow('[+] PhoneGap sslCertificateChecker'));
        } catch (err) {
            datas.push('[ ] PhoneGap sslCertificateChecker');
        }

        // IBM MobileFirst pinTrustedCertificatePublicKey (double bypass)
        try {
            // Bypass IBM MobileFirst {1}
            const WLClient_Activity_1 = Java.use('com.worklight.wlclient.api.WLClient');
            WLClient_Activity_1.getInstance().pinTrustedCertificatePublicKey.overload('java.lang.String').implementation = function (cert) {
                send_msg({type: 'action', data:('Bypassing IBM MobileFirst pinTrustedCertificatePublicKey (string): ' + cert)});
                return;
            };
            datas.push(clr_yellow('[+] IBM MobileFirst pinTrustedCertificatePublicKey (string)'));
        } catch (err) {
            datas.push('[ ] IBM MobileFirst pinTrustedCertificatePublicKey (string)');
        }
        try {
            // Bypass IBM MobileFirst {2}
            const WLClient_Activity_2 = Java.use('com.worklight.wlclient.api.WLClient');
            WLClient_Activity_2.getInstance().pinTrustedCertificatePublicKey.overload('[Ljava.lang.String;').implementation = function (cert) {
                send_msg({type: 'action', data:('Bypassing IBM MobileFirst pinTrustedCertificatePublicKey (string array): ' + cert)});
                return;
            };
            datas.push(clr_yellow('[+] IBM MobileFirst pinTrustedCertificatePublicKey (string array)'));
        } catch (err) {
            datas.push('[ ] IBM MobileFirst pinTrustedCertificatePublicKey (string array)');
        }

        // IBM WorkLight (ancestor of MobileFirst) HostNameVerifierWithCertificatePinning (quadruple bypass)
        try {
            // Bypass IBM WorkLight {1}
            const worklight_Activity_1 = Java.use('com.worklight.wlclient.certificatepinning.HostNameVerifierWithCertificatePinning');
            worklight_Activity_1.verify.overload('java.lang.String', 'javax.net.ssl.SSLSocket').implementation = function (a, b) {
                send_msg({type: 'action', data:('Bypassing IBM WorkLight HostNameVerifierWithCertificatePinning (SSLSocket): ' + a)});
                return;
            };
            datas.push(clr_yellow('[+] IBM WorkLight HostNameVerifierWithCertificatePinning (SSLSocket)'));
        } catch (err) {
            datas.push('[ ] IBM WorkLight HostNameVerifierWithCertificatePinning (SSLSocket)');
        }
        try {
            // Bypass IBM WorkLight {2}
            const worklight_Activity_2 = Java.use('com.worklight.wlclient.certificatepinning.HostNameVerifierWithCertificatePinning');
            worklight_Activity_2.verify.overload('java.lang.String', 'java.security.cert.X509Certificate').implementation = function (a, b) {
                send_msg({type: 'action', data:('Bypassing IBM WorkLight HostNameVerifierWithCertificatePinning (cert): ' + a)});
                return;
            };
            datas.push(clr_yellow('[+] IBM WorkLight HostNameVerifierWithCertificatePinning (cert)'));
        } catch (err) {
            datas.push('[ ] IBM WorkLight HostNameVerifierWithCertificatePinning (cert)');
        }
        try {
            // Bypass IBM WorkLight {3}
            const worklight_Activity_3 = Java.use('com.worklight.wlclient.certificatepinning.HostNameVerifierWithCertificatePinning');
            worklight_Activity_3.verify.overload('java.lang.String', '[Ljava.lang.String;', '[Ljava.lang.String;').implementation = function (a, b) {
                send_msg({type: 'action', data:('Bypassing IBM WorkLight HostNameVerifierWithCertificatePinning (string string): ' + a)});
                return;
            };
            datas.push(clr_yellow('[+] IBM WorkLight HostNameVerifierWithCertificatePinning (string string)'));
        } catch (err) {
            datas.push('[ ] IBM WorkLight HostNameVerifierWithCertificatePinning (string string)');
        }
        try {
            // Bypass IBM WorkLight {4}
            const worklight_Activity_4 = Java.use('com.worklight.wlclient.certificatepinning.HostNameVerifierWithCertificatePinning');
            worklight_Activity_4.verify.overload('java.lang.String', 'javax.net.ssl.SSLSession').implementation = function (a, b) {
                send_msg({type: 'action', data:('Bypassing IBM WorkLight HostNameVerifierWithCertificatePinning (SSLSession): ' + a)});
                return true;
            };
            datas.push(clr_yellow('[+] IBM WorkLight HostNameVerifierWithCertificatePinning (SSLSession)'));
        } catch (err) {
            datas.push('[ ] IBM WorkLight HostNameVerifierWithCertificatePinning (SSLSession)');
        }

        // Conscrypt CertPinManager
        try {
            const conscrypt_CertPinManager_Activity = Java.use('com.android.org.conscrypt.CertPinManager');
            conscrypt_CertPinManager_Activity.isChainValid.overload('java.lang.String', 'java.util.List').implementation = function (a, b) {
                send_msg({type: 'action', data:('Bypassing Conscrypt CertPinManager: ' + a)});
                return true;
            };
            datas.push(clr_yellow('[+] Conscrypt CertPinManager'));
        } catch (err) {
            datas.push('[ ] Conscrypt CertPinManager');
        }

        // CWAC-Netsecurity (unofficial back-port pinner for Android<4.2) CertPinManager
        try {
            const cwac_CertPinManager_Activity = Java.use('com.commonsware.cwac.netsecurity.conscrypt.CertPinManager');
            cwac_CertPinManager_Activity.isChainValid.overload('java.lang.String', 'java.util.List').implementation = function (a, b) {
                send_msg({type: 'action', data:('Bypassing CWAC-Netsecurity CertPinManager: ' + a)});
                return true;
            };
            datas.push(clr_yellow('[+] CWAC-Netsecurity CertPinManager'));
        } catch (err) {
            datas.push('[ ] CWAC-Netsecurity CertPinManager');
        }

        // Worklight Androidgap WLCertificatePinningPlugin
        try {
            const androidgap_WLCertificatePinningPlugin_Activity = Java.use('com.worklight.androidgap.plugin.WLCertificatePinningPlugin');
            androidgap_WLCertificatePinningPlugin_Activity.execute.overload('java.lang.String', 'org.json.JSONArray', 'org.apache.cordova.CallbackContext').implementation = function (a, b, c) {
                send_msg({type: 'action', data:('Bypassing Worklight Androidgap WLCertificatePinningPlugin: ' + a)});
                return true;
            };
            datas.push(clr_yellow('[+] Worklight Androidgap WLCertificatePinningPlugin'));
        } catch (err) {
            datas.push('[ ] Worklight Androidgap WLCertificatePinningPlugin');
        }

        // Netty FingerprintTrustManagerFactory
        try {
            const netty_FingerprintTrustManagerFactory = Java.use('io.netty.handler.ssl.util.FingerprintTrustManagerFactory');
            netty_FingerprintTrustManagerFactory.checkTrusted.implementation = function (type, chain) {
                send_msg({type: 'action', data:'Bypassing Netty FingerprintTrustManagerFactory'});
            };
            datas.push(clr_yellow('[+] Netty FingerprintTrustManagerFactory'));
        } catch (err) {
            datas.push('[ ] Netty FingerprintTrustManagerFactory');
        }

        // Squareup CertificatePinner [OkHTTP<v3] (double bypass)
        try {
            var OkHttpClient = Java.use("com.squareup.okhttp.OkHttpClient");
            OkHttpClient.setCertificatePinner.implementation = function(certificatePinner) {
                // do nothing
                send_msg({type: 'action', data:'OkHttpClient.setCertificatePinner Called!'});
                return this;
            };
            datas.push(clr_yellow('[+] Squareup OkHttpClient (setCert)'));
        } catch (err) {
            datas.push('[ ] Squareup OkHttpClient (setCert)');
        }
        try {
            // Bypass Squareup CertificatePinner {1}
            const Squareup_CertificatePinner_Activity_1 = Java.use('com.squareup.okhttp.CertificatePinner');
            Squareup_CertificatePinner_Activity_1.check.overload('java.lang.String', 'java.security.cert.Certificate').implementation = function (a, b) {
                send_msg({type: 'action', data:('Bypassing Squareup CertificatePinner (cert): ' + a)});
                return;
            };
            datas.push(clr_yellow('[+] Squareup CertificatePinner (cert)'));
        } catch (err) {
            datas.push('[ ] Squareup CertificatePinner (cert)');
        }
        try {
            // Bypass Squareup CertificatePinner {1}
            const Squareup_CertificatePinner_Activity_1 = Java.use('com.squareup.okhttp.CertificatePinner');
            Squareup_CertificatePinner_Activity_1.check.overload('java.lang.String', '[Ljava.security.cert.Certificate;').implementation = function (a, b) {
                send_msg({type: 'action', data:('Bypassing Squareup CertificatePinner (cert): ' + a)});
                return;
            };
            datas.push(clr_yellow('[+] Squareup CertificatePinner (cert)'));
        } catch (err) {
            datas.push('[ ] Squareup CertificatePinner (cert)');
        }
        try {
            // Bypass Squareup CertificatePinner {2}
            const Squareup_CertificatePinner_Activity_2 = Java.use('com.squareup.okhttp.CertificatePinner');
            Squareup_CertificatePinner_Activity_2.check.overload('java.lang.String', 'java.util.List').implementation = function (a, b) {
                send_msg({type: 'action', data:('Bypassing Squareup CertificatePinner (list): ' + a)});
                return;
            };
            datas.push(clr_yellow('[+] Squareup CertificatePinner (list)'));
        } catch (err) {
            datas.push('[ ] Squareup CertificatePinner (list)');
        }

        // Squareup OkHostnameVerifier [OkHTTP v3] (double bypass)
        try {
            // Bypass Squareup OkHostnameVerifier {1}
            const Squareup_OkHostnameVerifier_Activity_1 = Java.use('com.squareup.okhttp.internal.tls.OkHostnameVerifier');
            Squareup_OkHostnameVerifier_Activity_1.verify.overload('java.lang.String', 'java.security.cert.X509Certificate').implementation = function (a, b) {
                send_msg({type: 'action', data:('Bypassing Squareup OkHostnameVerifier (cert): ' + a)});
                return true;
            };
            datas.push(clr_yellow('[+] Squareup OkHostnameVerifier (cert)'));
        } catch (err) {
            datas.push('[ ] Squareup OkHostnameVerifier (cert)');
        }
        try {
            // Bypass Squareup OkHostnameVerifier {2}
            const Squareup_OkHostnameVerifier_Activity_2 = Java.use('com.squareup.okhttp.internal.tls.OkHostnameVerifier');
            Squareup_OkHostnameVerifier_Activity_2.verify.overload('java.lang.String', 'javax.net.ssl.SSLSession').implementation = function (a, b) {
                send_msg({type: 'action', data:('Bypassing Squareup OkHostnameVerifier (SSLSession): ' + a)});
                return true;
            };
            datas.push(clr_yellow('[+] Squareup OkHostnameVerifier (SSLSession)'));
        } catch (err) {
            datas.push('[ ] Squareup OkHostnameVerifier (SSLSession)');
        }

        // Android WebViewClient (double bypass)
        try {
            // Bypass WebViewClient {1} (deprecated from Android 6)
            const AndroidWebViewClient_Activity_1 = Java.use('android.webkit.WebViewClient');
            AndroidWebViewClient_Activity_1.onReceivedSslError.overload('android.webkit.WebView', 'android.webkit.SslErrorHandler', 'android.net.http.SslError').implementation = function (webView, sslErrorHandler, sslError) {
                send_msg({type: 'action', data:'Bypassing Android WebViewClient (SslErrorHandler)'});
				//todo: need check -- Ryan
				sslErrorHandler.proceed();
            };
            datas.push(clr_yellow('[+] Android WebViewClient (SslErrorHandler)'));
        } catch (err) {
            datas.push('[ ] Android WebViewClient (SslErrorHandler)');
        }
        try {
            // Bypass WebViewClient {2}
            const AndroidWebViewClient_Activity_2 = Java.use('android.webkit.WebViewClient');
            AndroidWebViewClient_Activity_2.onReceivedSslError.overload('android.webkit.WebView', 'android.webkit.WebResourceRequest', 'android.webkit.WebResourceError').implementation = function (obj1, obj2, obj3) {
                send_msg({type: 'action', data:'Bypassing Android WebViewClient (WebResourceError)'});
            };
            datas.push(clr_yellow('[+] Android WebViewClient (WebResourceError)'));
        } catch (err) {
            datas.push('[ ] Android WebViewClient (WebResourceError)');
        }
        try {
            // Bypass WebViewClient {3}
            const AndroidWebViewClient_Activity_3 = Java.use('android.webkit.WebViewClient');
			AndroidWebViewClient_Activity_3.onReceivedError.overload('android.webkit.WebView', 'int', 'java.lang.String', 'java.lang.String').implementation = function(a, b, c, d) {
                send_msg({type: 'action', data:'Bypassing Android WebViewClient (OnReceivedError[1])'});
            };
            datas.push(clr_yellow('[+] Android WebViewClient (OnReceivedError[1])'));
        } catch (err) {
            datas.push('[ ] Android WebViewClient (OnReceivedError[1])');
        }
        try {
            // Bypass WebViewClient {4}
            const AndroidWebViewClient_Activity_4 = Java.use('android.webkit.WebViewClient');
			AndroidWebViewClient_Activity_4.onReceivedError.overload('android.webkit.WebView', 'android.webkit.WebResourceRequest', 'android.webkit.WebResourceError').implementation = function() {
                send_msg({type: 'action', data:'Bypassing Android WebViewClient (OnReceivedError[2])'});
            };
            datas.push(clr_yellow('[+] Android WebViewClient (OnReceivedError[2])'));
        } catch (err) {
            datas.push('[ ] Android WebViewClient (OnReceivedError[3])');
        }

        // Apache Cordova WebViewClient
        try {
            const CordovaWebViewClient_Activity = Java.use('org.apache.cordova.CordovaWebViewClient');
            CordovaWebViewClient_Activity.onReceivedSslError.overload('android.webkit.WebView', 'android.webkit.SslErrorHandler', 'android.net.http.SslError').implementation = function (obj1, obj2, obj3) {
                send_msg({type: 'action', data:'Bypassing Apache Cordova WebViewClient'});
                obj3.proceed();
            };
            datas.push(clr_yellow('[+] Apache Cordova WebViewClient'));
        } catch (err) {
            datas.push('[ ] Apache Cordova WebViewClient');
        }

        // Boye AbstractVerifier
        try {
            const boye_AbstractVerifier = Java.use('ch.boye.httpclientandroidlib.conn.ssl.AbstractVerifier');
            boye_AbstractVerifier.verify.implementation = function (host, ssl) {
                send_msg({type: 'action', data:('Bypassing Boye AbstractVerifier: ' + host)});
            };
            datas.push(clr_yellow('[+] Boye AbstractVerifier'));
        } catch (err) {
            datas.push('[ ] Boye AbstractVerifier');
        }

        /*** Xutils3.x hooks ***/
        //Implement a new HostnameVerifier
        var TrustHostnameVerifier;
        try {
            TrustHostnameVerifier = Java.registerClass({
                name: 'org.wooyun.TrustHostnameVerifier',
                implements: [HostnameVerifier],
                methods: {
                    verify: function(hostname, session) {
						send_msg({type: 'action', data:'Bypassing HostnameVerifier verify'});
                        return true;
                    }
                }
            });
            var RequestParams = Java.use('org.xutils.http.RequestParams');
            // Prepare a Empty SSLFactory
            var TLS_SSLContext = SSLContext.getInstance("TLS");
            TLS_SSLContext.init(null, TrustManagers, null);
            var EmptySSLFactory = TLS_SSLContext.getSocketFactory();
			RequestParams.setSslSocketFactory.implementation = function(sslSocketFactory) {
                sslSocketFactory = EmptySSLFactory;
                return null;
            }
            RequestParams.setHostnameVerifier.implementation = function(hostnameVerifier) {
                hostnameVerifier = TrustHostnameVerifier.$new();
                return null;
            }
            datas.push(clr_yellow('[+] Xutils'));
        } catch (e) {
            datas.push('[ ] Xutils');
        }
        try {
            //cronet pinner hook
            //weibo don't invoke
            var netBuilder = Java.use("org.chromium.net.CronetEngine$Builder");
            //https://developer.android.com/guide/topics/connectivity/cronet/reference/org/chromium/net/CronetEngine.Builder.html#enablePublicKeyPinningBypassForLocalTrustAnchors(boolean)
            netBuilder.enablePublicKeyPinningBypassForLocalTrustAnchors.implementation = function(arg) {
                //weibo not invoke
                //console.log("Enables or disables public key pinning bypass for local trust anchors = " + arg);
                send_msg({type: 'action', data:('Cronet enablePublicKeyPinning = ' + arg)});
                //true to enable the bypass, false to disable.
                var ret = netBuilder.enablePublicKeyPinningBypassForLocalTrustAnchors.call(this, true);
                return ret;
            };

            netBuilder.addPublicKeyPins.implementation = function(hostName, pinsSha256, includeSubdomains, expirationDate) {
                send_msg({type: 'action', data:('Cronet addPublicKeyPins hostName = ' + hostName)});

                //var ret = netBuilder.addPublicKeyPins.call(this,hostName, pinsSha256,includeSubdomains, expirationDate);
                //this �ǵ��� addPublicKeyPins ǰ�Ķ�����? Yes,CronetEngine.Builder
                return this;
            };
            datas.push(clr_yellow('[+] Cronet pinner'));
        } catch (err) {
            datas.push('[ ] Cronet pinner');
        }

        // curl_easy_setopt
        const CURLOPT_CUSTOMREQUEST = 10036;
        const CURLOPT_URL = 10002;
        const CURLOPT_POSTFIELDS = 10015;
        const CURLOPT_HTTPHEADER = 10023;

        const CURLOPT_SSL_VERIFYPEER = 64;
        const CURLOPT_SSL_VERIFYHOST = 81;
        const CURLOPT_PINNEDPUBLICKEY = 10230;

        const NUL = ptr( '0x00' );

        try {
            let is_curl_located = false;
            let modules = Process.enumerateModules();
            for ( let _module of modules ) {
                let _export = _module.findExportByName( 'curl_easy_setopt' );
                if ( _export != null ) {
                    is_curl_located = true;
                    datas.push(clr_yellow(`[+] Curl Easy Setopt in ${_module.name}`));
                    Interceptor.attach( _export , {
                        onEnter: function ( args ) {
                            let opt = args[1].toInt32();

                            // log requests for a quick view
                            switch ( opt ) {
                                case CURLOPT_CUSTOMREQUEST:
                                    send_msg( `Method = ${ args[2].readCString() }` );
                                break;
                                case CURLOPT_URL:
                                    send_msg( `URL = ${ args[2].readCString() }` );
                                break;
                                case CURLOPT_POSTFIELDS:
                                    send_msg( 'Method = POST' );
                                break;
                            }

                            // skip options related to ssl pinning
                            if (
                                opt == CURLOPT_SSL_VERIFYPEER ||
                                opt == CURLOPT_SSL_VERIFYHOST ||
                                opt == CURLOPT_PINNEDPUBLICKEY
                            ){
                                args[2] = NUL;
                                send_msg({type:'action', data:`--> Bypassed libcurl SSL Pinning ( opt = ${opt} )`});
                            }
                        }
                    });
                }
            }

            if ( !is_curl_located ) {
                datas.push('[ ] Curl Easy Setopt')
            }
        } catch (err) {
            datas.push('[ ] Curl Easy Setopt')
        }

        datas.push(clr_yellow("Unpinning setup cmopleted"));
        send_msg(datas);
    });
}

function bypass_no_proxy_core(class_name, method_name){
    function get_proxy_value(_this){
        try{
            if(_this.client.value._proxy.value != null && _this.client.value._proxy.value.toString() == 'DIRECT'){
                return _this.client.value._proxy.value;
            }
        }catch(e){    }
        try{
            if(_this.client.value.proxy.value != null && _this.client.value.proxy.value.toString() == 'DIRECT'){
                return _this.client.value.proxy.value;
            }
        }catch(e){    }
        try{
            if(_this._client.value._proxy.value != null && _this._client.value._proxy.value.toString() == 'DIRECT'){
                return _this._client.value._proxy.value;
            }
        }catch(e){    }
        try{
            if(_this._client.value.proxy.value != null && _this._client.value.proxy.value.toString() == 'DIRECT'){
                return _this._client.value.proxy.value;
            }
        }catch(e){    }
        return null;
    }

    function set_proxy_value(_this, value){
        try{
            _this.client.value._proxy.value = value;
        }catch(e){    }
        try{
            _this.client.value.proxy.value = value;
        }catch(e){    }
        try{
            _this._client.value._proxy.value = value;
        }catch(e){    }
        try{
            _this._client.value.proxy.value = value;
        }catch(e){    }
    }

    return hook_func_frame(class_name, method_name, function(){
        let datas = [];
        let old_proxy = undefined;
        try{
            let cur_proxy = get_proxy_value(this);
            if(cur_proxy != null){
                let timestamp = (new Date()).getTime();
                let func_name = class_name + "." + method_name + "()";
                old_proxy = cur_proxy;
                this.client.value._proxy.value = null;
                datas.push({type:"stack", data:get_stack_trace(), timestamp:timestamp, funcName:func_name});
                datas.push({type:"action", data:"Bypassing no_proxy"});
            }
        }catch(e){
            console.error(e);
        }
        var response = this[method_name].apply(this, arguments);
        try{
            if(old_proxy != undefined){
                set_proxy_value(this, old_proxy);
                var request = this.request();
                datas.push(gen_request_data(request));
                datas.push(gen_response_data(response));
                send_msg(datas)
            }
        }catch(e){
            console.error(e);
        }
        return response;
    });
}

function bypass_no_proxy(){
    bypass_no_proxy_core('com.android.okhttp.internal.huc.HttpURLConnectionImpl', 'execute');
    bypass_no_proxy_core('com.android.okhttp.Call', 'execute');
    bypass_no_proxy_core('okhttp3.RealCall', 'execute');
}

function dump_signatures(){
    return wrap_java_perform(() => {
        const context = get_application_context();
        const PackageManager = java_use_safe("android.app.ApplicationPackageManager");
        const apk_name = context.getPackageName();
        let signatures = context.getPackageManager().getPackageInfo(apk_name, PackageManager.GET_SIGNATURES.value).signatures.value;
        console.log("number of signatures: ", clr_cyan(""+signatures.length));
        for(let i = 0; i < signatures.length; i++) {
            let byte_array = signatures[i].toByteArray();
            console.log("signature [" + clr_yellow(""+i) + "]: " + clr_cyan(""+byte_array.length));
            console.log(byte_array);
            console.log(signatures[i].toCharsString());
        }
    });
}

function toggle_cert_file_state(){
    is_show_cert_file = !is_show_cert_file;
    console.log(clr_cyan("set certificate file sniffer: ") + is_show_cert_file);
}

function hook_cert_file(){
    return wrap_java_perform(() => {
        Java.use("java.io.File").$init.overload('java.io.File', 'java.lang.String').implementation = function (file, cert) {
            var result = this.$init(file, cert)
            try{
                //匹配证书绑定的函数是否在调用链中
                if (is_show_cert_file && file != undefined && file != null && file.getPath().indexOf("cacert") >= 0) {
                    var stack = get_stack_trace();
//                    if (stack.indexOf("X509TrustManagerExtensions.checkServerTrusted") >= 0) {
                    if (stack.indexOf(".checkServerTrusted") >= 0) {
                        send_msg({type:"notify", data:("SSLpinning position locator => " + file.getPath() + " " + cert)});
                    }
                }
            }catch(e){
                console.error(e);
            }
            return result;
        }
        console.log(clr_cyan("Certificate file sniffer") + " is running...");
    });
}

function start_tls_key_logger() {
    if(!tls_key_logger_started){
        const SSL_CTX_new = Module.findExportByName('libssl.so', 'SSL_CTX_new');
        const SSL_CTX_set_keylog_callback = Module.findExportByName('libssl.so', 'SSL_CTX_set_keylog_callback');
        function keyLogger(ssl, line) {
            tls_key_list.push(new NativePointer(line).readCString())
        }
        const keyLogCallback = new NativeCallback(keyLogger, 'void', ['pointer', 'pointer']);

        Interceptor.attach(SSL_CTX_new, {
            onLeave: function(retval) {
                const ssl = new NativePointer(retval);
                const SSL_CTX_set_keylog_callbackFn = new NativeFunction(SSL_CTX_set_keylog_callback, 'void', ['pointer', 'pointer']);
                SSL_CTX_set_keylog_callbackFn(ssl, keyLogCallback);
            }
        });
        tls_key_logger_started = true;
        console.log(clr_cyan("TLS key logger") + " is running...");
    }
}

function list_tls_keys(){
    console.log('TLS keys: [' + clr_cyan(""+tls_key_list.length) + ']');
    for (let i = 0; i < tls_key_list.length; i++) {
        let parts = tls_key_list[i].split(' ');
        console.log(clr_yellow(parts[0]) + ' ' + clr_purple(parts[1]) + ' ' + clr_purple(parts[2]));
    }
}

function run_on_ui_thread(runnable){
    try{
        const IRunnable = Java.use('java.lang.Runnable');
        const currentActivity = get_current_activity();
        currentActivity.runOnUiThread(Java.cast(runnable, IRunnable));
    }catch(e){
        console.log("Exception from runOnUiThread："+e)
    }
}

function is_in_main_thread(){
    let cur_thread = Java.use("java.lang.Thread").currentThread();
    let main_thread = Java.use('android.os.Looper').getMainLooper().getThread();
    return cur_thread.value == main_thread.value;
}

function move_to_foreground(pkg_name){
    try{
        const context = get_application_context();
        const intent = context.getPackageManager().getLaunchIntentForPackage(pkg_name);
        context.startActivity(intent);
    }catch(e){
        console.error(e);
    }
}

var g_worker_class = null;

function set_threadpool_worker(class_name){
    g_worker_class = class_name;
    console.log('worker class: '+g_worker_class);
}

function hook_threadpool_execute(){
    let class_name = "java.util.concurrent.ThreadPoolExecutor";
    let method_name = "execute";
    var func = function(){
        try{
            let arg_class = get_real_class_name(arguments[0]);
            if(g_worker_class && (g_worker_class == '*' || arg_class == g_worker_class)){
                send_arguments_info(class_name+'.'+method_name+'()', arguments, false);
            }
        }catch(e){
            console.error(e);
        }
        //调用原应用的方法
        let ret = this[method_name].apply(this, arguments);
        return ret;
    }

    hook_func_frame(class_name, method_name, func);
    hook_func_frame(class_name, "runWorker", func);
}
