import Container from "../ui/Container";
import { H2, Small, Muted } from "../ui/typography";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function NewsletterSection() {
    return (
        <section className="py-20 bg-background transition-colors">
            <Container>
                <div className="bg-muted p-10 md:p-16 rounded-xl flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group">

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors" />

                    {/* Left Text */}
                    <div className="max-w-lg z-10">
                        <H2 className={cn("text-3xl md:text-4xl font-bold font-oswald uppercase text-foreground mb-4")}>
                            Stay Informed With the Latest & Most Important News
                        </H2>
                    </div>

                    {/* Right Form */}
                    <div className="w-full max-w-md z-10">
                        <form className="flex flex-col gap-4">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your email address</label>
                            <div className="flex gap-2">
                                <Input
                                    type="email"
                                    className="flex-grow"
                                    placeholder="Enter your email"
                                />
                                <Button variant="default" className="whitespace-nowrap">
                                    Subscribe
                                </Button>
                            </div>
                            <Muted className="text-[10px] leading-relaxed">
                                I consent to receive newsletter via email. For further information, please review our <a href="#" className="underline hover:text-primary">Privacy Policy</a>
                            </Muted>
                        </form>
                    </div>

                </div>
            </Container>
        </section>
    );
}
