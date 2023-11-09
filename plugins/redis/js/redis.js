function redisPost(method, version, args,callback){
    var loadT = layer.msg('正在获取...', { icon: 16, time: 0, shade: 0.3 });

    var req_data = {};
    req_data['name'] = 'redis';
    req_data['func'] = method;
    req_data['version'] = version;
 
    if (typeof(args) == 'string'){
        req_data['args'] = JSON.stringify(toArrayObject(args));
    } else {
        req_data['args'] = JSON.stringify(args);
    }

    $.post('/plugins/run', req_data, function(data) {
        layer.close(loadT);
        if (!data.status){
            //错误展示10S
            layer.msg(data.msg,{icon:0,time:2000,shade: [10, '#000']});
            return;
        }

        if(typeof(callback) == 'function'){
            callback(data);
        }
    },'json'); 
}

function redisPostCallbak(method, version, args,callback){
    var loadT = layer.msg('正在获取...', { icon: 16, time: 0, shade: 0.3 });

    var req_data = {};
    req_data['name'] = 'redis';
    req_data['func'] = method;
    args['version'] = version;
 
    if (typeof(args) == 'string'){
        req_data['args'] = JSON.stringify(toArrayObject(args));
    } else {
        req_data['args'] = JSON.stringify(args);
    }

    $.post('/plugins/callback', req_data, function(data) {
        layer.close(loadT);
        if (!data.status){
            layer.msg(data.msg,{icon:0,time:2000,shade: [0.3, '#000']});
            return;
        }

        if(typeof(callback) == 'function'){
            callback(data);
        }
    },'json'); 
}

//redis状态  start
function redisStatus(version) {

    redisPost('run_info',version, {},function(data){
        var rdata = $.parseJSON(data.data);

        hit = (parseInt(rdata.keyspace_hits) / (parseInt(rdata.keyspace_hits) + parseInt(rdata.keyspace_misses)) * 100).toFixed(2);
        var con = '<div class="divtable">\
                        <table class="table table-hover table-bordered" style="width: 490px;">\
                        <thead><th>字段</th><th>当前值</th><th>说明</th></thead>\
                        <tbody>\
                            <tr><th>uptime_in_days</th><td>' + rdata.uptime_in_days + '</td><td>已运行天数</td></tr>\
                            <tr><th>tcp_port</th><td>' + rdata.tcp_port + '</td><td>当前监听端口</td></tr>\
                            <tr><th>connected_clients</th><td>' + rdata.connected_clients + '</td><td>连接的客户端数量</td></tr>\
                            <tr><th>used_memory_rss</th><td>' + toSize(rdata.used_memory_rss) + '</td><td>Redis当前占用的系统内存总量</td></tr>\
                            <tr><th>used_memory</th><td>' + toSize(rdata.used_memory) + '</td><td>Redis当前已分配的内存总量</td></tr>\
                            <tr><th>used_memory_peak</th><td>' + toSize(rdata.used_memory_peak) + '</td><td>Redis历史分配内存的峰值</td></tr>\
                            <tr><th>mem_fragmentation_ratio</th><td>' + rdata.mem_fragmentation_ratio + '%</td><td>内存碎片比率</td></tr>\
                            <tr><th>total_connections_received</th><td>' + rdata.total_connections_received + '</td><td>运行以来连接过的客户端的总数量</td></tr>\
                            <tr><th>total_commands_processed</th><td>' + rdata.total_commands_processed + '</td><td>运行以来执行过的命令的总数量</td></tr>\
                            <tr><th>instantaneous_ops_per_sec</th><td>' + rdata.instantaneous_ops_per_sec + '</td><td>服务器每秒钟执行的命令数量</td></tr>\
                            <tr><th>keyspace_hits</th><td>' + rdata.keyspace_hits + '</td><td>查找数据库键成功的次数</td></tr>\
                            <tr><th>keyspace_misses</th><td>' + rdata.keyspace_misses + '</td><td>查找数据库键失败的次数</td></tr>\
                            <tr><th>hit</th><td>' + hit + '%</td><td>查找数据库键命中率</td></tr>\
                            <tr><th>latest_fork_usec</th><td>' + rdata.latest_fork_usec + '</td><td>最近一次 fork() 操作耗费的微秒数</td></tr>\
                        <tbody>\
                </table></div>';
        $(".soft-man-con").html(con);
    });
}

function replStatus(version){
    redisPost('info_replication', version, {},function(data){
        var rdata = $.parseJSON(data.data);

        console.log(rdata)
        // if (!rdata.status){
        //     layer.msg(data.msg,{icon:0,time:2000,shade: [0.3, '#000']});
        //     return;
        // }

        var con = '<div class="divtable">\
                        <table class="table table-hover table-bordered" style="width: 490px;">\
                        <thead><th style="width:80px;">字段</th><th style="width:80px;">当前值</th><th>说明</th></thead>\
                        <tbody>\
                            <tr><th>role</th><td>' + rdata.role + '</td><td>角色</td></tr>\
                            <tr><th>master_host</th><td>' + rdata.master_host + '</td><td>连接主库HOST</td></tr>\
                            <tr><th>master_port</th><td>' + rdata.master_port + '</td><td>连接主库PORT</td></tr>\
                            <tr><th>master_link_status</th><td>' + rdata.master_link_status + '</td><td>连接主库状态</td></tr>\
                            <tr><th>master_last_io_seconds_ago</th><td>' + rdata.master_last_io_seconds_ago + '</td><td>上次同步时间</td></tr>\
                            <tr><th>master_sync_in_progress</th><td>' +rdata.master_sync_in_progress + '</td><td>正在同步中</td></tr>\
                            <tr><th>slave_read_repl_offset</th><td>' + rdata.slave_read_repl_offset + '</td><td>从库读取复制位置</td></tr>\
                            <tr><th>slave_repl_offset</th><td>' + rdata.slave_repl_offset + '</td><td>从库复制位置</td></tr>\
                            <tr><th>slave_priority</th><td>' + rdata.slave_priority + '</td><td>从库同步优先级</td></tr>\
                            <tr><th>slave_read_only</th><td>' + rdata.slave_read_only + '</td><td>从库是否仅读</td></tr>\
                            <tr><th>replica_announced</th><td>' + rdata.replica_announced + '</td><td>已复制副本</td></tr>\
                            <tr><th>connected_slaves</th><td>' + rdata.connected_slaves + '</td><td>连接数量</td></tr>\
                            <tr><th>master_failover_state</th><td>'+rdata.master_failover_state+'</td><td>主库故障状态</td></tr>\
                            <tr><td>master_replid</td><td class="overflow_hide" style="width:70px;display: inline-block;border: none;">' + rdata.master_replid + '</td><td>主库复制ID</td></tr>\
                            <tr><th>master_repl_offset</th><td>'+rdata.master_repl_offset+'</td><td>主库复制位置</td></tr>\
                            <tr><th>second_repl_offset</th><td>'+rdata.second_repl_offset+'</td><td>主库复制位置时间</td></tr>\
                            <tr><th>repl_backlog_size</th><td>'+rdata.repl_backlog_size+'</td><td>复制大小</td></tr>\
                            <tr><th>repl_backlog_first_byte_offset</th><td>'+rdata.repl_backlog_first_byte_offset+'</td><td>第一个字节偏移量</td></tr>\
                            <tr><th>repl_backlog_histlen</th><td>'+rdata.repl_backlog_histlen+'</td><td>backlog中数据的长度</td></tr>\
                        <tbody>\
                </table></div>';
        $(".soft-man-con").html(con);
    });
}
//redis状态 end

//配置修改
function getRedisConfig(version) {
    redisPost('get_redis_conf', version,'',function(data){
        // console.log(data);
        var rdata = $.parseJSON(data.data);
        // console.log(rdata);
        var mlist = '';
        for (var i = 0; i < rdata.length; i++) {
            var w = '70'
            if (rdata[i].name == 'error_reporting') w = '250';
            var ibody = '<input style="width: ' + w + 'px;" class="bt-input-text mr5" name="' + rdata[i].name + '" value="' + rdata[i].value + '" type="text" >';
            switch (rdata[i].type) {
                case 0:
                    var selected_1 = (rdata[i].value == 1) ? 'selected' : '';
                    var selected_0 = (rdata[i].value == 0) ? 'selected' : '';
                    ibody = '<select class="bt-input-text mr5" name="' + rdata[i].name + '" style="width: ' + w + 'px;"><option value="1" ' + selected_1 + '>开启</option><option value="0" ' + selected_0 + '>关闭</option></select>'
                    break;
                case 1:
                    var selected_1 = (rdata[i].value == 'On') ? 'selected' : '';
                    var selected_0 = (rdata[i].value == 'Off') ? 'selected' : '';
                    ibody = '<select class="bt-input-text mr5" name="' + rdata[i].name + '" style="width: ' + w + 'px;"><option value="On" ' + selected_1 + '>开启</option><option value="Off" ' + selected_0 + '>关闭</option></select>'
                    break;
            }
            mlist += '<p><span>' + rdata[i].name + '</span>' + ibody + ', <font>' + rdata[i].ps + '</font></p>'
        }
        var con = '<style>.conf_p p{margin-bottom: 2px}</style><div class="conf_p" style="margin-bottom:0">' + mlist + '\
                        <div style="margin-top:10px; padding-right:15px" class="text-right"><button class="btn btn-success btn-sm mr5" onclick="getRedisConfig(\'' + version + '\')">刷新</button>\
                        <button class="btn btn-success btn-sm" onclick="submitConf(\'' + version + '\')">保存</button></div>\
                    </div>'
        $(".soft-man-con").html(con);
    });
}

//提交配置
function submitConf(version) {
    var data = {
        version: version,
        bind: $("input[name='bind']").val(),
        'port': $("input[name='port']").val(),
        'timeout': $("input[name='timeout']").val(),
        maxclients: $("input[name='maxclients']").val(),
        databases: $("input[name='databases']").val(),
        requirepass: $("input[name='requirepass']").val(),
        maxmemory: $("input[name='maxmemory']").val(),
    };

    redisPost('submit_redis_conf', version, data, function(ret_data){
        var rdata = $.parseJSON(ret_data.data);
        layer.msg(rdata.msg, { icon: rdata.status ? 1 : 2 });
    });
}

