using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Web.Models
{
    [Table("database_settings", Schema="mc")]
    public class DatabaseSetting
    {
        [Key, Column("setting_id")]
        public string SettingId { get; set; }
        [Column("setting_value")]
        public string SettingValue { get; set; }
    }
}