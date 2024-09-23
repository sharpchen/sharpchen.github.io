# Repository

## Pros & Cons

- Pros
    - Easy mocking
    - Fast

- Cons
    - A lot methods need to be implemented.
    - Repository class are maintained in main project not test project.

## Repository pattern

Repository is a interface bridges logic behind the DbContext, can have bunch of methods that basically do CRUD.

```cs
public interface IRepository<T> where T : class // dto is always a class
{
    Task<T> GetByIdAsync(int id);
    Task<IEnumerable<T>> GetAllAsync();
    Task AddAsync(T entity);
    void Update(T entity);
    void Delete(T entity);
    Task<int> SaveChangesAsync();
}
```

Each implementor of Repository should wrap a DbContext to implement all CRUD methods.

```cs
public class FooRepository : IRepository<Foo>
{
    readonly FooContext _context;
    public FooRepository(FooContext context) => _context = context;
    // rest implementations...
}
```

## Take over DbContext from controller and DI

Since Repository has take the position to do CRUD, we now should replace DbContext.

```cs
[ApiController]
[Route("[controller]")]
public class FooController : Controller
{
    readonly IRepository _repository;
    public FooController(repository) => _repository = repository;
    // rest implementations...
}
```

Remap for DI

```cs
builder.Services.AddTransient<IRepository<Foo>, FooRepository>();
```

## Do the testing!

A fake repository object is needed to perform testing, `MockQueryable.NSubstitute` installed earlier will do the job.

```cs
using NSubstitute;
using Microsoft.AspNetCore.Mvc;

public class RepositoryTest
{
    [Fact]
    public async Task IfFooExists_ReturnsFoo()
    {
        // Arrange

        // create a fake repository
        var repository = Substitute.For<IRepository<Foo>>(); 
        // asserts that the Get method with param 2 should return certain object, etc.
        // async methods should return a task
        repository.GetByIdAsync(2)!.Returns(Task.FromResult(new Foo { Id = 2, Name = "Action" }));

        var controller = new FooController(repository);
        
        // Act
        var response = await controller.GetByIdAsync(2);
        var okResult = response as OkObjectResult;
        
        // Assert
        Assert.NotNull(okResult);
        Assert.Equal(200, okResult.StatusCode);
        Assert.Equal("Action", (okResult.Value as Foo)?.Name);
        // assert the fake repository has called the method.
        // because this method should called inside the controller!
        await repository.Received().GetByIdAsync(2); 
    }
}
```
