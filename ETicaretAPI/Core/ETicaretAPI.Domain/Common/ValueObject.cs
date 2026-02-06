using System.Collections.Generic;

namespace ETicaretAPI.Domain.Common
{
    public abstract class ValueObject
    {
        protected static bool EqualOperator(ValueObject? left, ValueObject? right)
        {
            if (ReferenceEquals(left, null) ^ ReferenceEquals(right, null))
            {
                return false;
            }
            return ReferenceEquals(left, null) || left.Equals(right);
        }

        protected static bool NotEqualOperator(ValueObject? left, ValueObject? right)
        {
            return !EqualOperator(left, right);
        }

        protected abstract IEnumerable<object> GetEqualityComponents();

        public override bool Equals(object? obj)
        {
            if (obj == null || obj.GetType() != GetType())
            {
                return false;
            }

            var other = (ValueObject)obj;
            var thisComponents = GetEqualityComponents().GetEnumerator();
            var otherComponents = other.GetEqualityComponents().GetEnumerator();
            while (thisComponents.MoveNext() && otherComponents.MoveNext())
            {
                if (!ReferenceEquals(thisComponents.Current, null) &&
                    !ReferenceEquals(otherComponents.Current, null))
                {
                    if (!thisComponents.Current.Equals(otherComponents.Current))
                    {
                        return false;
                    }
                }
                else if (!ReferenceEquals(thisComponents.Current, otherComponents.Current))
                {
                    return false;
                }
            }
            return !thisComponents.MoveNext() && !otherComponents.MoveNext();
        }

        public static bool operator ==(ValueObject? left, ValueObject? right)
        {
            return EqualOperator(left, right);
        }

        public static bool operator !=(ValueObject? left, ValueObject? right)
        {
            return NotEqualOperator(left, right);
        }

        public override int GetHashCode()
        {
            return GetEqualityComponents()
                .Select(x => x != null ? x.GetHashCode() : 0)
                .Aggregate((x, y) => x ^ y);
        }
    }
} 