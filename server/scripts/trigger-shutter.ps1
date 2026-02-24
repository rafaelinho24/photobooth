Add-Type -TypeDefinition @"
using System;
using System.Text;
using System.Runtime.InteropServices;
public class Win32 {
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);
    [DllImport("user32.dll")]
    public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);
    [DllImport("user32.dll")]
    public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);
    [DllImport("user32.dll")]
    public static extern bool PostMessage(IntPtr hWnd, UInt32 Msg, IntPtr wParam, IntPtr lParam);
}
"@ -ErrorAction SilentlyContinue

# WHY: FindWindow fails when the title has a leading space (EOS Utility quirk).
# EnumWindows with partial match is more robust.
$target = [IntPtr]::Zero
$callback = [Win32+EnumWindowsProc]{
    param($hwnd, $param)
    $sb = New-Object System.Text.StringBuilder 256
    [Win32]::GetWindowText($hwnd, $sb, 256) | Out-Null
    if ($sb.ToString() -like "*EOS R6m2*") {
        $script:target = $hwnd
        return $false
    }
    return $true
}
[Win32]::EnumWindows($callback, [IntPtr]::Zero) | Out-Null

if ($target -eq [IntPtr]::Zero) {
    Write-Error "EOS Utility window not found"
    exit 1
}

# Send WM_KEYDOWN then WM_KEYUP for VK_SPACE (0x20)
[Win32]::PostMessage($target, 0x0100, [IntPtr]0x20, [IntPtr]0x00390001) | Out-Null
Start-Sleep -Milliseconds 80
[Win32]::PostMessage($target, 0x0101, [IntPtr]0x20, [IntPtr]0xC0390001) | Out-Null
