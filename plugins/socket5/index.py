# coding:utf-8

import sys
import io
import os
import time
import shutil

sys.path.append(os.getcwd() + "/class/core")
import mw

app_debug = False
if mw.isAppleSystem():
    app_debug = True


def getPluginName():
    return 'socket5'


def getPluginDir():
    return mw.getPluginDir() + '/' + getPluginName()


def getServerDir():
    return mw.getServerDir() + '/' + getPluginName()


def getArgs():
    args = sys.argv[2:]
    tmp = {}
    args_len = len(args)

    if args_len == 1:
        t = args[0].strip('{').strip('}')
        t = t.split(':')
        tmp[t[0]] = t[1]
    elif args_len > 1:
        for i in range(len(args)):
            t = args[i].split(':')
            tmp[t[0]] = t[1]

    return tmp


def checkArgs(data, ck=[]):
    for i in range(len(ck)):
        if not ck[i] in data:
            return (False, mw.returnJson(False, '参数:(' + ck[i] + ')没有!'))
    return (True, mw.returnJson(True, 'ok'))


def status():
    cmd = "ps -ef|grep ss5 |grep -v grep | grep -v python | awk '{print $2}'"
    data = mw.execShell(cmd)
    if data[0] == '':
        return 'stop'
    return 'start'


def initConf():
    ss5_conf = getServerDir() + '/ss5.conf'
    if not os.path.exists(ss5_conf):
        mw.execShell('cp -rf ' + getPluginDir() +
                     '/tmp/ss5.conf' + ' ' + getServerDir())

    ss5_pwd = getServerDir() + '/ss5.passwd'
    if not os.path.exists(ss5_pwd):
        mw.execShell('cp -rf ' + getPluginDir() +
                     '/tmp/ss5.passwd' + ' ' + getServerDir())


def start():
    initConf()

    if mw.isAppleSystem():
        return "Apple Computer does not support"

    data = mw.execShell('service ss5 start')
    if data[0] == '':
        return 'ok'
    return data[1]


def stop():
    if mw.isAppleSystem():
        return "Apple Computer does not support"

    data = mw.execShell('service ss5 stop')
    if data[0] == '':
        return 'ok'
    return data[1]


def restart():
    if mw.isAppleSystem():
        return "Apple Computer does not support"

    data = mw.execShell('service ss5 restart')
    if data[0] == '':
        return 'ok'
    return data[1]


def reload():
    data = mw.execShell('service ss5 reload')
    if data[0] == '':
        return 'ok'
    return data[1]


def getPathFile():
    if mw.isAppleSystem():
        return getServerDir() + '/ss5.conf'
    return '/etc/opt/ss5/ss5.conf'


def getPathFilePwd():
    if mw.isAppleSystem():
        return getServerDir() + '/ss5.passwd'
    return '/etc/opt/ss5/ss5.passwd'


if __name__ == "__main__":
    func = sys.argv[1]
    if func == 'status':
        print status()
    elif func == 'start':
        print start()
    elif func == 'stop':
        print stop()
    elif func == 'restart':
        print restart()
    elif func == 'reload':
        print reload()
    elif func == 'conf':
        print getPathFile()
    elif func == 'conf_pwd':
        print getPathFilePwd()
    else:
        print 'error'
