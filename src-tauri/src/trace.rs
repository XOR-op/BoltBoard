use chrono::Timelike;
use tracing_subscriber::fmt::format::Writer;
use tracing_subscriber::fmt::time::FormatTime;
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;
use tracing_subscriber::{fmt, EnvFilter};

#[derive(Debug, Clone, Copy, Eq, PartialEq, Default)]
pub struct LocalTime;

impl FormatTime for LocalTime {
    fn format_time(&self, w: &mut Writer<'_>) -> core::fmt::Result {
        let time = chrono::prelude::Local::now();
        write!(
            w,
            "{:02}:{:02}:{:02}.{:03}",
            time.hour() % 24,
            time.minute(),
            time.second(),
            time.timestamp_subsec_millis()
        )
    }
}

pub fn init_tracing() {
    let stdout_layer = fmt::layer()
        .compact()
        .with_writer(std::io::stdout)
        .with_timer(LocalTime::default());

    tracing_subscriber::registry()
        .with(stdout_layer)
        .with(EnvFilter::new("boltboard-tauri=info"))
        .init();
}
