using System.ComponentModel.DataAnnotations;

public record RegisterKampDto(
    [Required(ErrorMessage = "Tidspunkt er påkrævet")]
    [StringLength(50, ErrorMessage = "Tidspunkt må maksimalt være 50 tegn")]
    string tidspunkt,
    
    [Required(ErrorMessage = "Vinder navn er påkrævet")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Vinder navn skal være mellem 2 og 100 tegn")]
    string vinder,
    
    [Range(0, 999, ErrorMessage = "Vinderens score skal være mellem 0 og 999")]
    int vinderScore,
    
    [Required(ErrorMessage = "Taber navn er påkrævet")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Taber navn skal være mellem 2 og 100 tegn")]
    string taber,
    
    [Range(0, 999, ErrorMessage = "Taberens score skal være mellem 0 og 999")]
    int taberScore);
