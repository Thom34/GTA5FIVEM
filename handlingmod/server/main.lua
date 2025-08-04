local ESX = exports["es_extended"]:getSharedObject()

ESX.RegisterServerCallback('handlingmod:isAuthorized', function(source, cb)
    local xPlayer = ESX.GetPlayerFromId(source)
    if xPlayer then
        local group = xPlayer.getGroup()
        cb(group == 'admin' or group == 'superadmin')
    else
        cb(false)
    end
end)

