import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "./button";

const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const languages = useMemo(
    () => [
      { code: "en", name: "English" },
      { code: "jp", name: "日本語" },
      { code: "es", name: "Español" },
      { code: "ph", name: "Tagalog" },
    ],
    []
  );

  // State to track the current language
  const [currentLanguage, setCurrentLanguage] = useState(
    () => languages.find((lang) => lang.code === i18n.language) || languages[0]
  );

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    const selectedLang = languages.find((lang) => lang.code === languageCode);
    setCurrentLanguage(selectedLang || languages[0]);
  };

  // Update the state if the language changes dynamically from outside (like on page load)
  useEffect(() => {
    const lang = languages.find((lang) => lang.code === i18n.language);
    setCurrentLanguage(lang || languages[0]);
  }, [i18n.language, languages]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-28">
        <Button size="icon" className="p-4">
          <Languages className="mr-1 w-3 h-3"/>
          {currentLanguage.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;
