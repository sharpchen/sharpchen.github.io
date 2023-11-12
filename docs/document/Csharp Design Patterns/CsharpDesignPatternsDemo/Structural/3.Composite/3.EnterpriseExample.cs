namespace CsharpDesignPatternsDemo.Structural.Composite;

abstract class Specification<T>
{
    public abstract bool IsSatisfiedWith(T t);
}

abstract class CompositeSpecification<T> : Specification<T>
{
    protected readonly Specification<T>[] specifications;
    protected CompositeSpecification(params Specification<T>[] specifications) => this.specifications = specifications;
}

class AndSpecification<T>(params Specification<T>[] specifications) : CompositeSpecification<T>(specifications)
{
    public override bool IsSatisfiedWith(T t) => specifications.All(x => x.IsSatisfiedWith(t));
}
class OrSpecification<T>(params Specification<T>[] specifications) : CompositeSpecification<T>(specifications)
{
    public override bool IsSatisfiedWith(T t) => specifications.Any(x => x.IsSatisfiedWith(t));
}
