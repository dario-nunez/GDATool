package com.mycompany;
import com.mycompany.jobs.HelperFunctions;
import org.junit.Test;
import static org.junit.Assert.assertEquals;

public class HelperFunctionsTests {
    private final String c = HelperFunctions.replaceCharacter;
    @Test
    public void validNameIsNotChanged() {
        String validName = HelperFunctions.getValidColumnName("city");
        assertEquals(validName, "city");
    }

    @Test
    public void invalidNameContainingCOMMAIsCanged() {
        String validName = HelperFunctions.getValidColumnName("ci,ty");
        assertEquals(validName, String.format("ci%sty", c));
    }

    @Test
    public void invalidNameContainingSEMICOLONIsCanged() {
        String validName = HelperFunctions.getValidColumnName("ci;ty");
        assertEquals(validName, String.format("ci%sty", c));
    }

    @Test
    public void invalidNameContainingCURLYBRACEOPENCanged() {
        String validName = HelperFunctions.getValidColumnName("ci{ty");
        assertEquals(validName, String.format("ci%sty", c));
    }

    @Test
    public void invalidNameContainingCURLYBRACECLOSEDCanged() {
        String validName = HelperFunctions.getValidColumnName("ci}ty");
        assertEquals(validName, String.format("ci%sty", c));
    }

    @Test
    public void invalidNameContainingBRACKETOPENCanged() {
        String validName = HelperFunctions.getValidColumnName("ci(ty");
        assertEquals(validName, String.format("ci%sty", c));
    }

    @Test
    public void invalidNameContainingBRACKETCLOSEDCanged() {
        String validName = HelperFunctions.getValidColumnName("ci)ty");
        assertEquals(validName, String.format("ci%sty", c));
    }

    @Test
    public void invalidNameContainingSLASHNCanged() {
        String validName = HelperFunctions.getValidColumnName("ci\nty");
        assertEquals(validName, String.format("ci%sty", c));
    }

    @Test
    public void invalidNameContainingTEQUALSCanged() {
        String validName = HelperFunctions.getValidColumnName("cit=ty");
        assertEquals(validName, String.format("ci%sty", c));
    }

    @Test
    public void invalidNameContainingAllInvalidCharactersIntercalatedCanged() {
        String validName = HelperFunctions.getValidColumnName("a,a;a{a}a(a)a\nat=a");
        String formattedInput = "a%sa%sa%sa%sa%sa%sa%sa%sa";
        assertEquals(validName, formattedInput.replace("%s", c));
    }

    @Test
    public void invalidNameContainingAllInvalidCharactersSequentiallyCanged() {
        String validName = HelperFunctions.getValidColumnName("a,;{}()\nt=a");
        String formattedInput = "a%s%s%s%s%s%s%s%sa";
        assertEquals(validName, formattedInput.replace("%s", c));
    }

    @Test
    public void other() {
        String validName = HelperFunctions.getValidColumnName("Country / territory0");
        assertEquals(validName, "Country___territory0");
    }
}
