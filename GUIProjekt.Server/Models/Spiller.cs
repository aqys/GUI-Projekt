using System.ComponentModel.DataAnnotations;

public record Spiller(
    int id,
    
    [Required(ErrorMessage = "Navn er påkrævet")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Navn skal være mellem 2 og 100 tegn")]
    [RegularExpression(@"^[a-zA-Z\s'-]+$", ErrorMessage = "Navn må kun indeholde bogstaver, mellemrum, apostrof og bindestreg")]
    string navn);
