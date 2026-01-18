import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import AddNewInterview from "./_components/AddNewInterview";
import InterviewListServer from "./_components/InterviewList.server";

const stepsData = [
  {
    head: "Step 1: Set Up Your Interview",
    desc: "Log in and choose your job role, skills, and experience level. Our AI instantly generates tailored interview questions designed specifically for your profile.",
    array: [
      "Suitable for all job roles and industries",
      "Covers both fundamental and role-specific questions",
    ],
    image: "Screenshot 2026-01-18 083650.png",
  },
  {
    head: "Step 2: Experience a Real Interview",
    desc: "Answer the questions by recording your audio and video, just like a real interview. This creates a realistic hybrid interview experience that helps you build confidence.",
    array: [
      "Multiple questions with mixed difficulty levels",
      "Simulates real interview pressure in a safe environment",
      "Your privacy matters: no audio or video is stored",
    ],
    image: "Screenshot 2026-01-18 094807.png",
  },
  {
    head: "Step 3: Get Instant AI Feedback",
    desc: "Receive immediate, in-depth feedback with a clear performance score and analysis report.",
    array: [
      "Understand the right approach to answering each question",
      "Identify strengths and areas for improvement",
      "Previous results are saved to help you focus on future progress",
    ],
    image: "Screenshot 2026-01-18 095035.png",
  },
];

const Dashboard = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER SECTION */}
      <div className="flex p-4 items-center justify-between bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Image
            src={"/ai-removebg-preview.svg"}
            width={50}
            height={50}
            alt="logo"
          />
          <h2 className="font-bold text-xl hidden md:block text-slate-800">
            AI-Interview-MOCKER
          </h2>
        </div>
        <UserButton />
      </div>

      <div className="max-w-[1400px] mx-auto">
        {/* TOP SECTION: Hero & Previous Interviews */}
        <div className="p-5 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* CONTENT LEFT: The Text Section */}
          <div className="flex flex-col justify-center space-y-5">
            <h2 className="text-emerald-500 font-bold bg-emerald-50 w-fit px-3 py-1 rounded-full text-sm">
              #1 AI Interview Prep
            </h2>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
              Boost your confidence, <br />
              <span className="text-emerald-300">ace the job interview</span>
            </h1>
            <p className="text-gray-500 text-lg md:max-w-md">
              Practice job interview questions tailored to your job description.
              Get instant AI feedback and suggestions to improve your answers.
            </p>

            <div className="pt-4">
              <AddNewInterview />
            </div>
          </div>

          {/* CONTENT RIGHT: Previous Mock Interviews Stack */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
            <div className="mb-5 border-b pb-4">
              <h2 className="font-bold text-2xl text-slate-800">
                Previous Mock Interviews
              </h2>
              <p className="text-gray-500 text-sm">
                See your previous experiences
              </p>
            </div>

            {/* Scrollable list of cards */}
            <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <InterviewListServer userEmail={userEmail} />
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Why Use & Feature Steps */}
        <div className="mt-20 border-t bg-slate-50/50">
          <div className="py-16 px-5 text-center max-w-3xl mx-auto">
            <h2 className="text-teal-600 font-bold mb-4">How it works</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
              Get Started in 3 Simple Steps
            </h3>
            <p className="text-gray-600 text-lg italic">
              "Why Use Our AI Mock Interview Platform? Practice smarter, improve
              faster, and walk into your next interview with confidence."
            </p>
          </div>

          {/* Feature Section Grid */}
          <section className="pb-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-24">
            {stepsData.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col gap-10 md:items-center ${
                  index % 2 !== 0 ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                {/* Text Side */}
                <div className="flex-1 space-y-6">
                  <span className="text-blue-600 font-bold tracking-widest uppercase text-sm">
                    Phase 0{index + 1}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                    {step.head}
                  </h2>
                  <p className="text-lg text-gray-600">{step.desc}</p>

                  <ul className="space-y-4">
                    {step.array.map((bullet, i) => (
                      <li key={i} className="flex items-start">
                        <div className="mt-1 flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="ml-3 text-gray-700 font-medium">
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Image Side */}
                <div className="flex-1">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden aspect-video flex items-center justify-center">
                      {step.image === "#" ? (
                        <div className="bg-slate-100 w-full h-full flex flex-col items-center justify-center text-slate-400 p-10 text-center">
                          <p className="text-sm font-medium">
                            Screenshot Placeholder
                          </p>
                          <p className="text-xs italic">
                            Step {index + 1} Visual
                          </p>
                        </div>
                      ) : (
                        <img
                          src={step.image}
                          alt={step.head}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>

      <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight flex justify-center items-center text-center p-10">
        That is it, give yourself a unfair advantage in this competition!
      </h1>
    </div>
  );
};

export default Dashboard;
