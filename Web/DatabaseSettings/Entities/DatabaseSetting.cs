using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Web.Models
{
    [Table("databaseSettings", Schema="mc")]
    public class DatabaseSetting
    {
        [Key]
        public string SettingId { get; set; }
        public string SettingValue { get; set; }
    }
}