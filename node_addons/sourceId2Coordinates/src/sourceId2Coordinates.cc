#if defined(IS_WINDOWS)
#include <windows.h>
#endif

#include "sourceId2Coordinates.h"

/**
 * Tries to get the coordinates of a desktop from passed sourceId
 * (which identifies a desktop sharing source). Used to match the source id to a
 * screen in Electron.
 *
 * Returns true on success and false on failure.
 *
 * NOTE: Works on windows only because on the other platforms there is an easier
 * way to match the source id and the screen.
 */
bool sourceId2Coordinates(int sourceId, Point* res)
{
#if defined(IS_WINDOWS)
    DISPLAY_DEVICE device;
    device.cb = sizeof(device);

    if (!EnumDisplayDevices(NULL, sourceId, &device, 0) // device not found
        || !(device.StateFlags & DISPLAY_DEVICE_ACTIVE))// device is not active
    {
        return false;
    }

    DEVMODE deviceSettings;
    deviceSettings.dmSize = sizeof(deviceSettings);
    deviceSettings.dmDriverExtra = 0;
    if(!EnumDisplaySettingsEx(device.DeviceName, ENUM_CURRENT_SETTINGS,
        &deviceSettings, 0))
    {
        return false;
    }

    res->x = deviceSettings.dmPosition.x;
    res->y = deviceSettings.dmPosition.y;

    return true;
#else
    return false;
#endif
}
