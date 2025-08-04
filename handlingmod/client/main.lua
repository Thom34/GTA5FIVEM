local ESX = exports["es_extended"]:getSharedObject()
local menuOpen = false

-- List of handling properties to be managed by the UI
local handlingFields = {
    "fEnginePowerMultiplier",
    "fInitialDriveForce",
    "fBrakeForce",
    "fBrakeBiasFront",
    "fHandBrakeForce",
    "fSteeringLock",
    "fTractionCurveMax",
    "fTractionCurveMin",
    "fTractionCurveLateral",
    "fSuspensionForce",
    "fSuspensionCompDamp",
    "fSuspensionReboundDamp",
    "fSuspensionUpperLimit",
    "fSuspensionLowerLimit",
    "fSuspensionRaise",
    "fAntiRollBarForce",
    "fAntiRollBarBiasFront",
    "fRollCentreHeightFront",
    "fRollCentreHeightRear"
}

RegisterCommand('handling', function()
    ESX.TriggerServerCallback('handlingmod:isAuthorized', function(allowed)
        if not allowed then
            lib.notify({ title = 'Handling', description = "Vous n'êtes pas autorisé à utiliser cette commande" })
            ESX.ShowNotification("Vous n'êtes pas autorisé à utiliser cette commande")
            return
        end

        menuOpen = not menuOpen
        SetNuiFocus(menuOpen, menuOpen)

        if menuOpen then
            local playerPed = PlayerPedId()
            local vehicle = GetVehiclePedIsIn(playerPed, false)
            local handlingData = {}

            if vehicle ~= 0 then
                -- Populate the handlingData table with current vehicle values
                for _, field in ipairs(handlingFields) do
                    -- NOTE: We are assuming 'CHandlingData' is the correct class name.
                    -- This is a common pattern, but might need adjustment if it fails.
                    handlingData[field] = GetVehicleHandlingFloat(vehicle, 'CHandlingData', field)
                end
                SendNUIMessage({
                    type = 'open',
                    handlingData = handlingData
                })
            else
                -- If not in a vehicle, send a message to show a relevant message in the UI
                SendNUIMessage({
                    type = 'open',
                    handlingData = nil
                })
            end
        else
            SendNUIMessage({
                type = 'close'
            })
        end
    end)
end, false)

RegisterNUICallback('close', function(data, cb)
    menuOpen = false
    SetNuiFocus(false, false)
    SendNUIMessage({
        type = 'close'
    })
    cb('ok')
end)

RegisterNUICallback('updateHandling', function(data, cb)
    local playerPed = PlayerPedId()
    local vehicle = GetVehiclePedIsIn(playerPed, false)

    if vehicle ~= 0 and data.key and data.value then
        -- Apply the updated handling value to the vehicle
        SetVehicleHandlingFloat(vehicle, 'CHandlingData', data.key, tonumber(data.value))
    end

    cb('ok')
end)
