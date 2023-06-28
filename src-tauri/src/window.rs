use tauri::{AppHandle, Runtime, Window, WindowBuilder, WindowUrl, Wry};

pub trait WindowExt {
    #[cfg(target_os = "macos")]
    fn set_transparent_titlebar(&self);
}

impl<R: Runtime> WindowExt for Window<R> {
    #[cfg(target_os = "macos")]
    fn set_transparent_titlebar(&self) {
        use cocoa::appkit::{NSWindow, NSWindowStyleMask, NSWindowTitleVisibility};

        unsafe {
            let id = self.ns_window().unwrap() as cocoa::base::id;

            let mut style_mask = id.styleMask();
            style_mask.set(NSWindowStyleMask::NSFullSizeContentViewWindowMask, true);
            id.setStyleMask_(style_mask);

            id.setTitleVisibility_(NSWindowTitleVisibility::NSWindowTitleHidden);
            id.setTitlebarAppearsTransparent_(cocoa::base::YES);
            id.setMovableByWindowBackground_(cocoa::base::YES)
        }
    }
}

pub fn create_dashboard(app: &AppHandle<Wry>) -> Window<Wry> {
    let window = WindowBuilder::new(
        app,
        "dashboard",
        WindowUrl::App("./dashboard/index.html".into()),
    )
    .resizable(true)
    .closable(true)
    .accept_first_mouse(true)
    .title("Boltboard")
    .center()
    .maximizable(false)
    .minimizable(false)
    .theme(None)
    .inner_size(800., 600.)
    .build()
    .unwrap();
    window.set_transparent_titlebar();
    window
}
