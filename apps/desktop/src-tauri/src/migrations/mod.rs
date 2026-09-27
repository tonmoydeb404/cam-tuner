use rusqlite_migration::{Migrations, M};

pub fn migrations() -> Migrations<'static> {
    Migrations::new(vec![
        M::up(include_str!("sql/v1__initial.sql")),
        // Add future migrations here:
        // M::up(include_str!("sql/v2__your_next_migration.sql")),
    ])
}
