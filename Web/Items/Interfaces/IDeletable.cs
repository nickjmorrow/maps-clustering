using System;

namespace Web.Models
{
    public interface IDeletable
    {
        DateTime? DateDeleted { get; }
    }
}