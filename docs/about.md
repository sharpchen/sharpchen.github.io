# Complex Modeling

## Motivation

Columns from database are flat, but sometimes we'll want to represent certain columns as a whole model to better describe them in code base.
In other words, we need higher abstraction upon the columns.

## Complex property

```cs
record class Person(string? FirstName, string? LastName);
public class Movie
{
    public int Identifier { get; set; }
    public string? Title { get; set; }
    public DateTime ReleaseDate { get; set; }
    public string? Synopsis { get; set; }
    public string? DirectorFirstName { get; set; } // [!code --]
    public string? DirectorLastName { get; set; } // [!code --]
    public Person? Director { get; set; } // [!code ++]
}
```

Entity framework core will spread properties of `Director` as column mappings for database,
which means we should have `Director_FirstName` and `Director_LastName` as columns in database.

```cs
builder.ComplexProperty(movie => movie.Director); // spread the structured property
```

Certainly, we can override mappings if you don't like the convetion.

```cs
builder.ComplexProperty(movie => movie.Director)
    .Property(movie => movie.FirstName) // [!code highlight]
    .HasColumnName("d_firstname"); // [!code highlight]
```

## Complex modeling across tables


```cs
// equivalent to `ComplexProperty`
builder.OwnsOne(movie => movie.Director); // each movie entity owns one director
```

Generally we should separate the columns about something obviously not primitive to the table itself into another table for preventing pollution.

```cs
builder.OwnsOne(movie => movie.Director)
    .ToTable("Directors") // move director to another table // [!code highlight]
```

Since director is owned by `Movie` entity, Entity framework core generates a foreign key in director table as reference for movie table(also a primary key).
But director table is not independent, if a row of movie is removed, the director row will also be removed(yes directors are not reused).

:::info
It's not common solution we do in database design, it's just a showcase.
:::

### OwnsMany

One movie will have multiple casts.

```cs
public class Movie
{
    public int Identifier { get; set; }
    public string? Title { get; set; }
    public DateTime ReleaseDate { get; set; }
    public string? Synopsis { get; set; }
    public Person? Director { get; set; }
    public ICollection<Person>? Casts { get; set; } // [!code ++]
}
```

While one entity can own many other entites, we use `OwnsMany`.

```cs
builder.OwnsMany(movie => movie.Casts)
    .ToTable("Casts"); // [!code highlight]
```

