import { LandingContent } from "@/components/landing-content";
import { LandingHero } from "@/components/landing-hero";
import { LandingNavbar } from "@/components/landing-navabar";
import {Button} from "@/components/ui/button"
import Link from "next/link";

const LandingPage = () => {
    return (  
       <div className="h-full">
        <LandingNavbar />
        <LandingHero />
        <LandingContent />

       </div>
    );
}
 
export default LandingPage;