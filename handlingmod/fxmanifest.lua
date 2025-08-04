fx_version 'cerulean'
games { 'gta5' }

author 'Jules'
description 'Un mod de handling avancé pour FiveM.'
version '1.0.0'

dependency 'es_extended'

client_script 'client/main.lua'
server_script 'server/main.lua'

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/style.css',
    'html/script.js'
}
