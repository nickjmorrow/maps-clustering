using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Models
{
    [Table("testValues", Schema = "dbo")]
    public class TestValue
    {
        [Key]
        public string TestValueId { get; set; }
    }
}
