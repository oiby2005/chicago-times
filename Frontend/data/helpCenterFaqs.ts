export interface HelpTopicItem {
  id: string;
  title: string;
  category: string;
  answer: string[];
  steps?: string[];
  tips?: string[];
}

export interface HelpCategory {
  id: string;
  title: string;
  items: HelpTopicItem[];
}

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    "id": "general-information",
    "title": "General Information",
    "items": [
      {
        "id": "general-information-q1",
        "title": "What is Times Chicago?",
        "category": "General Information",
        "answer": [
          "Times Chicago is a news and information website operated by Times Chicago LLC.",
          "For the most accurate assistance, consult the relevant page or policy on the website and include any useful context when contacting the team. Features and procedures may change, so this answer should be read together with the current information published by Times Chicago LLC."
        ]
      },
      {
        "id": "general-information-q2",
        "title": "What can I find on the website?",
        "category": "General Information",
        "answer": [
          "You can browse published news, articles, commentary, and other content available in the website’s sections.",
          "If the issue persists, note the exact URL, the approximate time, and the device or browser you were using. Do not include passwords or other sensitive information in a support request."
        ]
      },
      {
        "id": "general-information-q3",
        "title": "How can I contact Times Chicago?",
        "category": "General Information",
        "answer": [
          "Email worldnews@timeschicago.com and include a clear subject line explaining your enquiry.",
          "For the most accurate assistance, consult the relevant page or policy on the website and include any useful context when contacting the team. Features and procedures may change, so this answer should be read together with the current information published by Times Chicago LLC."
        ]
      },
      {
        "id": "general-information-q4",
        "title": "Where can I find information about the company?",
        "category": "General Information",
        "answer": [
          "Visit the About Us page, if available, for information about the organization, its mission, and its work.",
          "For the most accurate assistance, consult the relevant page or policy on the website and include any useful context when contacting the team. Features and procedures may change, so this answer should be read together with the current information published by Times Chicago LLC."
        ]
      },
      {
        "id": "general-information-q5",
        "title": "How can I stay informed about website updates?",
        "category": "General Information",
        "answer": [
          "Visit the website regularly and check whether newsletter or notification options are available.",
          "If the issue persists, note the exact URL, the approximate time, and the device or browser you were using. Do not include passwords or other sensitive information in a support request."
        ]
      },
      {
        "id": "general-information-q6",
        "title": "Where can I find the website’s policies?",
        "category": "General Information",
        "answer": [
          "Review the relevant policy pages on the website, including privacy, cookie, editorial, copyright, and terms pages, where published.",
          "If the issue persists, note the exact URL, the approximate time, and the device or browser you were using. Do not include passwords or other sensitive information in a support request."
        ]
      }
    ]
  },
  {
    "id": "news-articles",
    "title": "News & Articles",
    "items": [
      {
        "id": "news-articles-q1",
        "title": "How do I read an article?",
        "category": "News & Articles",
        "answer": [
          "Open the article headline or its link to view the full content available on the website.",
          "Include the relevant article title or URL and any background the editorial team needs to understand your request. Editorial decisions depend on verification, relevance, available resources, and the organization’s published standards; a submission or request does not guarantee publication or a particular change."
        ]
      },
      {
        "id": "news-articles-q2",
        "title": "How can I find news by topic?",
        "category": "News & Articles",
        "answer": [
          "Use the website’s navigation menu or category links to browse topics, where available.",
          "For the most accurate assistance, consult the relevant page or policy on the website and include any useful context when contacting the team. Features and procedures may change, so this answer should be read together with the current information published by Times Chicago LLC."
        ]
      },
      {
        "id": "news-articles-q3",
        "title": "Can I share an article with someone?",
        "category": "News & Articles",
        "answer": [
          "You may share the article’s public URL. Respect copyright and applicable terms when reusing its content.",
          "Include the relevant article title or URL and any background the editorial team needs to understand your request. Editorial decisions depend on verification, relevance, available resources, and the organization’s published standards; a submission or request does not guarantee publication or a particular change."
        ]
      },
      {
        "id": "news-articles-q4",
        "title": "Why was an article updated?",
        "category": "News & Articles",
        "answer": [
          "Articles may be updated to add information, clarify details, or correct errors. Check for an update or correction note.",
          "Include the relevant article title or URL and any background the editorial team needs to understand your request. Editorial decisions depend on verification, relevance, available resources, and the organization’s published standards; a submission or request does not guarantee publication or a particular change."
        ]
      },
      {
        "id": "news-articles-q5",
        "title": "Why can’t I find an article I read earlier?",
        "category": "News & Articles",
        "answer": [
          "The article may have moved, been updated, or been removed. Email worldnews@timeschicago.com with its title or previous URL.",
          "Include the relevant article title or URL and any background the editorial team needs to understand your request. Editorial decisions depend on verification, relevance, available resources, and the organization’s published standards; a submission or request does not guarantee publication or a particular change."
        ]
      },
      {
        "id": "news-articles-q6",
        "title": "Can I rely on every article as professional advice?",
        "category": "News & Articles",
        "answer": [
          "News content is for general information and is not legal, medical, financial, or other professional advice unless expressly stated.",
          "Include the relevant article title or URL and any background the editorial team needs to understand your request. Editorial decisions depend on verification, relevance, available resources, and the organization’s published standards; a submission or request does not guarantee publication or a particular change."
        ]
      }
    ]
  },
  {
    "id": "search-navigation",
    "title": "Search & Navigation",
    "items": [
      {
        "id": "search-navigation-q1",
        "title": "How do I search for a specific story?",
        "category": "Search & Navigation",
        "answer": [
          "Use the website search feature, if available, and enter keywords from the headline, subject, person, or event.",
          "Include the relevant article title or URL and any background the editorial team needs to understand your request. Editorial decisions depend on verification, relevance, available resources, and the organization’s published standards; a submission or request does not guarantee publication or a particular change."
        ]
      },
      {
        "id": "search-navigation-q2",
        "title": "What if search results are not relevant?",
        "category": "Search & Navigation",
        "answer": [
          "Try more specific keywords, alternative spellings, or a shorter phrase from the story.",
          "If the issue persists, note the exact URL, the approximate time, and the device or browser you were using. Do not include passwords or other sensitive information in a support request."
        ]
      },
      {
        "id": "search-navigation-q3",
        "title": "How do I browse a news category?",
        "category": "Search & Navigation",
        "answer": [
          "Select the relevant category from the website menu or category links, where available.",
          "For the most accurate assistance, consult the relevant page or policy on the website and include any useful context when contacting the team. Features and procedures may change, so this answer should be read together with the current information published by Times Chicago LLC."
        ]
      },
      {
        "id": "search-navigation-q4",
        "title": "Why does a link open an error page?",
        "category": "Search & Navigation",
        "answer": [
          "The page may have moved, the URL may be incorrect, or the page may be temporarily unavailable. Contact support with the link.",
          "Providing precise details helps the team review the concern efficiently. Include relevant quotations, dates, links, or supporting records where possible, and explain the outcome you are requesting."
        ]
      },
      {
        "id": "search-navigation-q5",
        "title": "Can I bookmark an article?",
        "category": "Search & Navigation",
        "answer": [
          "Use your browser’s bookmark feature to save an article URL for later access.",
          "Include the relevant article title or URL and any background the editorial team needs to understand your request. Editorial decisions depend on verification, relevance, available resources, and the organization’s published standards; a submission or request does not guarantee publication or a particular change."
        ]
      },
      {
        "id": "search-navigation-q6",
        "title": "How do I return to the homepage?",
        "category": "Search & Navigation",
        "answer": [
          "Select the Times Chicago logo or the Home link if available.",
          "If the issue persists, note the exact URL, the approximate time, and the device or browser you were using. Do not include passwords or other sensitive information in a support request."
        ]
      }
    ]
  },
  {
    "id": "reader-accounts-profiles",
    "title": "Reader Accounts & Profiles",
    "items": [
      {
        "id": "reader-accounts-profiles-q1",
        "title": "Do I need an account to read articles?",
        "category": "Reader Accounts & Profiles",
        "answer": [
          "Account requirements depend on the website’s current features. Follow the instructions shown on the article page.",
          "Include the relevant article title or URL and any background the editorial team needs to understand your request. Editorial decisions depend on verification, relevance, available resources, and the organization’s published standards; a submission or request does not guarantee publication or a particular change."
        ]
      },
      {
        "id": "reader-accounts-profiles-q2",
        "title": "How do I create an account?",
        "category": "Reader Accounts & Profiles",
        "answer": [
          "If registration is offered, use the sign-up option and follow the on-screen instructions.",
          "Use only the account or subscription controls actually shown on the website, and check any confirmation messages or spam folders where relevant. If the feature is unavailable or the problem continues, contact support with a short description of the issue and avoid sharing passwords."
        ]
      },
      {
        "id": "reader-accounts-profiles-q3",
        "title": "What if I cannot log in?",
        "category": "Reader Accounts & Profiles",
        "answer": [
          "Check your login details and use the password-reset option if available. If the issue continues, contact support.",
          "For the most accurate assistance, consult the relevant page or policy on the website and include any useful context when contacting the team. Features and procedures may change, so this answer should be read together with the current information published by Times Chicago LLC."
        ]
      },
      {
        "id": "reader-accounts-profiles-q4",
        "title": "How can I reset my password?",
        "category": "Reader Accounts & Profiles",
        "answer": [
          "Select the password-reset link on the login page, if provided, and follow the instructions sent to your email.",
          "Use only the account or subscription controls actually shown on the website, and check any confirmation messages or spam folders where relevant. If the feature is unavailable or the problem continues, contact support with a short description of the issue and avoid sharing passwords."
        ]
      },
      {
        "id": "reader-accounts-profiles-q5",
        "title": "How can I update account details?",
        "category": "Reader Accounts & Profiles",
        "answer": [
          "If profile settings are available, sign in and use the account or profile section.",
          "Use only the account or subscription controls actually shown on the website, and check any confirmation messages or spam folders where relevant. If the feature is unavailable or the problem continues, contact support with a short description of the issue and avoid sharing passwords."
        ]
      },
      {
        "id": "reader-accounts-profiles-q6",
        "title": "How can I request account deletion?",
        "category": "Reader Accounts & Profiles",
        "answer": [
          "Email worldnews@timeschicago.com and explain the account you want deleted. Identity verification may be required.",
          "Please share only the information needed to explain your request and avoid sending passwords or unnecessary sensitive details by email. Any request will be considered under the website’s published policies and applicable legal requirements."
        ]
      }
    ]
  },
  {
    "id": "newsletters-notifications",
    "title": "Newsletters & Notifications",
    "items": [
      {
        "id": "newsletters-notifications-q1",
        "title": "Does Times Chicago offer a newsletter?",
        "category": "Newsletters & Notifications",
        "answer": [
          "Availability may change. Check the website for a sign-up form or contact us to ask.",
          "Use only the account or subscription controls actually shown on the website, and check any confirmation messages or spam folders where relevant. If the feature is unavailable or the problem continues, contact support with a short description of the issue and avoid sharing passwords."
        ]
      },
      {
        "id": "newsletters-notifications-q2",
        "title": "How can I subscribe to a newsletter?",
        "category": "Newsletters & Notifications",
        "answer": [
          "If a sign-up form is available, enter the requested information and follow confirmation instructions.",
          "Use only the account or subscription controls actually shown on the website, and check any confirmation messages or spam folders where relevant. If the feature is unavailable or the problem continues, contact support with a short description of the issue and avoid sharing passwords."
        ]
      },
      {
        "id": "newsletters-notifications-q3",
        "title": "How do I unsubscribe from emails?",
        "category": "Newsletters & Notifications",
        "answer": [
          "Use the unsubscribe link included in the email, where provided, or contact worldnews@timeschicago.com.",
          "Use only the account or subscription controls actually shown on the website, and check any confirmation messages or spam folders where relevant. If the feature is unavailable or the problem continues, contact support with a short description of the issue and avoid sharing passwords."
        ]
      },
      {
        "id": "newsletters-notifications-q4",
        "title": "Why am I not receiving newsletter emails?",
        "category": "Newsletters & Notifications",
        "answer": [
          "Check your spam folder, confirm your registered address, and review email filters.",
          "Use only the account or subscription controls actually shown on the website, and check any confirmation messages or spam folders where relevant. If the feature is unavailable or the problem continues, contact support with a short description of the issue and avoid sharing passwords."
        ]
      },
      {
        "id": "newsletters-notifications-q5",
        "title": "Can I change the topics I receive?",
        "category": "Newsletters & Notifications",
        "answer": [
          "If preference controls are available, use them. Otherwise, contact the team for assistance.",
          "For the most accurate assistance, consult the relevant page or policy on the website and include any useful context when contacting the team. Features and procedures may change, so this answer should be read together with the current information published by Times Chicago LLC."
        ]
      },
      {
        "id": "newsletters-notifications-q6",
        "title": "How can I report an email impersonating Times Chicago?",
        "category": "Newsletters & Notifications",
        "answer": [
          "Send details or a screenshot to worldnews@timeschicago.com. Avoid clicking suspicious links or sharing passwords.",
          "Use only the account or subscription controls actually shown on the website, and check any confirmation messages or spam folders where relevant. If the feature is unavailable or the problem continues, contact support with a short description of the issue and avoid sharing passwords."
        ]
      }
    ]
  },
  {
    "id": "article-submissions",
    "title": "Article Submissions",
    "items": [
      {
        "id": "article-submissions-q1",
        "title": "Can I submit an article for publication?",
        "category": "Article Submissions",
        "answer": [
          "Email worldnews@timeschicago.com with your proposed topic and ask whether submissions are currently accepted.",
          "Include the relevant article title or URL and any background the editorial team needs to understand your request. Editorial decisions depend on verification, relevance, available resources, and the organization’s published standards; a submission or request does not guarantee publication or a particular change."
        ]
      },
      {
        "id": "article-submissions-q2",
        "title": "What should an article submission include?",
        "category": "Article Submissions",
        "answer": [
          "Include a proposed headline, article text or pitch, your name, contact details, relevant sources, and disclosures about conflicts or third-party material.",
          "Include the relevant article title or URL and any background the editorial team needs to understand your request. Editorial decisions depend on verification, relevance, available resources, and the organization’s published standards; a submission or request does not guarantee publication or a particular change."
        ]
      },
      {
        "id": "article-submissions-q3",
        "title": "How should I submit a story idea?",
        "category": "Article Submissions",
        "answer": [
          "Send a concise summary explaining the story, why it matters, available evidence, and how the editorial team can contact you.",
          "Include the relevant article title or URL and any background the editorial team needs to understand your request. Editorial decisions depend on verification, relevance, available resources, and the organization’s published standards; a submission or request does not guarantee publication or a particular change."
        ]
      },
      {
        "id": "article-submissions-q4",
        "title": "Does submitting an article guarantee publication?",
        "category": "Article Submissions",
        "answer": [
          "No. Submissions may be reviewed, edited, declined, or held for further verification.",
          "Include the relevant article title or URL and any background the editorial team needs to understand your request. Editorial decisions depend on verification, relevance, available resources, and the organization’s published standards; a submission or request does not guarantee publication or a particular change."
        ]
      },
      {
        "id": "article-submissions-q5",
        "title": "Can I submit an article published elsewhere?",
        "category": "Article Submissions",
        "answer": [
          "Tell the editorial team where it appeared and confirm that you have the necessary rights. Publication is not guaranteed.",
          "Include the relevant article title or URL and any background the editorial team needs to understand your request. Editorial decisions depend on verification, relevance, available resources, and the organization’s published standards; a submission or request does not guarantee publication or a particular change."
        ]
      },
      {
        "id": "article-submissions-q6",
        "title": "How long does review take?",
        "category": "Article Submissions",
        "answer": [
          "Review times vary with topic, workload, verification needs, and editorial priorities; an exact timeline may not be available.",
          "For the most accurate assistance, consult the relevant page or policy on the website and include any useful context when contacting the team. Features and procedures may change, so this answer should be read together with the current information published by Times Chicago LLC."
        ]
      }
    ]
  },
  {
    "id": "writers-contributors",
    "title": "Writers & Contributors",
    "items": [
      {
        "id": "writers-contributors-q1",
        "title": "How can I become a contributor?",
        "category": "Writers & Contributors",
        "answer": [
          "Send an introduction, relevant experience or writing samples, and proposed topics to worldnews@timeschicago.com.",
          "Include the relevant article title or URL and any background the editorial team needs to understand your request. Editorial decisions depend on verification, relevance, available resources, and the organization’s published standards; a submission or request does not guarantee publication or a particular change."
        ]
      },
      {
        "id": "writers-contributors-q2",
        "title": "Are contributor guidelines available?",
        "category": "Writers & Contributors",
        "answer": [
          "Check the website or request current requirements by email.",
          "Include the relevant article title or URL and any background the editorial team needs to understand your request. Editorial decisions depend on verification, relevance, available resources, and the organization’s published standards; a submission or request does not guarantee publication or a particular change."
        ]
      },
      {
        "id": "writers-contributors-q3",
        "title": "Can contributors choose their own topics?",
        "category": "Writers & Contributors",
        "answer": [
          "You may pitch topics, but acceptance and editorial direction depend on relevance, evidence, and editorial priorities.",
          "Include the relevant article title or URL and any background the editorial team needs to understand your request. Editorial decisions depend on verification, relevance, available resources, and the organization’s published standards; a submission or request does not guarantee publication or a particular change."
        ]
      },
      {
        "id": "writers-contributors-q4",
        "title": "Will my article be edited?",
        "category": "Writers & Contributors",
        "answer": [
          "Content may be edited for accuracy, clarity, style, length, legal concerns, and consistency with editorial standards.",
          "Include the relevant article title or URL and any background the editorial team needs to understand your request. Editorial decisions depend on verification, relevance, available resources, and the organization’s published standards; a submission or request does not guarantee publication or a particular change."
        ]
      },
      {
        "id": "writers-contributors-q5",
        "title": "How should contributors disclose conflicts?",
        "category": "Writers & Contributors",
        "answer": [
          "Disclose financial, personal, professional, or other relationships that could affect the article or readers’ understanding.",
          "Include the relevant article title or URL and any background the editorial team needs to understand your request. Editorial decisions depend on verification, relevance, available resources, and the organization’s published standards; a submission or request does not guarantee publication or a particular change."
        ]
      },
      {
        "id": "writers-contributors-q6",
        "title": "Are contributors automatically paid?",
        "category": "Writers & Contributors",
        "answer": [
          "Payment terms, if any, must be agreed in writing before work begins. Do not assume compensation unless confirmed.",
          "Include the relevant article title or URL and any background the editorial team needs to understand your request. Editorial decisions depend on verification, relevance, available resources, and the organization’s published standards; a submission or request does not guarantee publication or a particular change."
        ]
      }
    ]
  },
  {
    "id": "editorial-review-publication",
    "title": "Editorial Review & Publication",
    "items": [
      {
        "id": "editorial-review-publication-q1",
        "title": "How are articles reviewed?",
        "category": "Editorial Review & Publication",
        "answer": [
          "Articles may be assessed for accuracy, sourcing, relevance, clarity, fairness, originality, legal risks, and editorial standards.",
          "Include the relevant article title or URL and any background the editorial team needs to understand your request. Editorial decisions depend on verification, relevance, available resources, and the organization’s published standards; a submission or request does not guarantee publication or a particular change."
        ]
      },
      {
        "id": "editorial-review-publication-q2",
        "title": "Can the editorial team change my headline?",
        "category": "Editorial Review & Publication",
        "answer": [
          "Yes. Headlines may be edited for clarity, accuracy, style, or fit while fairly representing the article.",
          "Include the relevant article title or URL and any background the editorial team needs to understand your request. Editorial decisions depend on verification, relevance, available resources, and the organization’s published standards; a submission or request does not guarantee publication or a particular change."
        ]
      },
      {
        "id": "editorial-review-publication-q3",
        "title": "Why has my submitted article not been published?",
        "category": "Editorial Review & Publication",
        "answer": [
          "It may be under review, require more information, or not have been selected. You may request an update by email.",
          "Include the relevant article title or URL and any background the editorial team needs to understand your request. Editorial decisions depend on verification, relevance, available resources, and the organization’s published standards; a submission or request does not guarantee publication or a particular change."
        ]
      },
      {
        "id": "editorial-review-publication-q4",
        "title": "Can I request changes after publication?",
        "category": "Editorial Review & Publication",
        "answer": [
          "Send the article URL and specific requested changes to worldnews@timeschicago.com. Requests are reviewed, not automatically approved.",
          "For the most accurate assistance, consult the relevant page or policy on the website and include any useful context when contacting the team. Features and procedures may change, so this answer should be read together with the current information published by Times Chicago LLC."
        ]
      },
      {
        "id": "editorial-review-publication-q5",
        "title": "Does publication mean Times Chicago endorses every opinion?",
        "category": "Editorial Review & Publication",
        "answer": [
          "No. Publication does not necessarily mean the organization endorses every claim or opinion expressed by a source or contributor.",
          "For the most accurate assistance, consult the relevant page or policy on the website and include any useful context when contacting the team. Features and procedures may change, so this answer should be read together with the current information published by Times Chicago LLC."
        ]
      },
      {
        "id": "editorial-review-publication-q6",
        "title": "Can I republish an article after it appears?",
        "category": "Editorial Review & Publication",
        "answer": [
          "Obtain written permission or confirm a valid licence or legal exception before republishing protected content.",
          "Before using protected material, identify the rights holder and check any licence or permission conditions, including attribution, permitted formats, and commercial-use restrictions. If you are unsure whether your intended use is allowed, ask for written permission before publishing or distributing the material."
        ]
      }
    ]
  },
  {
    "id": "editorial-standards-ethics",
    "title": "Editorial Standards & Ethics",
    "items": [
      {
        "id": "editorial-standards-ethics-q1",
        "title": "How does Times Chicago approach accuracy?",
        "category": "Editorial Standards & Ethics",
        "answer": [
          "The editorial approach calls for reasonable verification, careful checking of details, and clear treatment of uncertainty.",
          "For the most accurate assistance, consult the relevant page or policy on the website and include any useful context when contacting the team. Features and procedures may change, so this answer should be read together with the current information published by Times Chicago LLC."
        ]
      },
      {
        "id": "editorial-standards-ethics-q2",
        "title": "How are sources evaluated?",
        "category": "Editorial Standards & Ethics",
        "answer": [
          "Writers and editors should consider a source’s knowledge, credibility, evidence, possible motives, and corroboration.",
          "For the most accurate assistance, consult the relevant page or policy on the website and include any useful context when contacting the team. Features and procedures may change, so this answer should be read together with the current information published by Times Chicago LLC."
        ]
      },
      {
        "id": "editorial-standards-ethics-q3",
        "title": "Does Times Chicago separate news and opinion?",
        "category": "Editorial Standards & Ethics",
        "answer": [
          "Content should be presented clearly so readers can distinguish reporting, opinion, analysis, and sponsored material.",
          "For the most accurate assistance, consult the relevant page or policy on the website and include any useful context when contacting the team. Features and procedures may change, so this answer should be read together with the current information published by Times Chicago LLC."
        ]
      },
      {
        "id": "editorial-standards-ethics-q4",
        "title": "How are conflicts of interest handled?",
        "category": "Editorial Standards & Ethics",
        "answer": [
          "Staff and contributors should disclose material conflicts so editors can assess suitable steps.",
          "For the most accurate assistance, consult the relevant page or policy on the website and include any useful context when contacting the team. Features and procedures may change, so this answer should be read together with the current information published by Times Chicago LLC."
        ]
      },
      {
        "id": "editorial-standards-ethics-q5",
        "title": "How does the website handle sensitive reporting?",
        "category": "Editorial Standards & Ethics",
        "answer": [
          "Reporting involving children, vulnerable people, privacy, or serious allegations should consider context and foreseeable harm.",
          "If the issue persists, note the exact URL, the approximate time, and the device or browser you were using. Do not include passwords or other sensitive information in a support request."
        ]
      },
      {
        "id": "editorial-standards-ethics-q6",
        "title": "How are AI tools used in editorial work?",
        "category": "Editorial Standards & Ethics",
        "answer": [
          "AI tools may support certain tasks, but outputs require appropriate human review and verification before publication.",
          "Include the relevant article title or URL and any background the editorial team needs to understand your request. Editorial decisions depend on verification, relevance, available resources, and the organization’s published standards; a submission or request does not guarantee publication or a particular change."
        ]
      }
    ]
  },
  {
    "id": "corrections-complaints",
    "title": "Corrections & Complaints",
    "items": [
      {
        "id": "corrections-complaints-q1",
        "title": "How do I report a factual error?",
        "category": "Corrections & Complaints",
        "answer": [
          "Email worldnews@timeschicago.com with the article URL, disputed statement, and reliable supporting information.",
          "Providing precise details helps the team review the concern efficiently. Include relevant quotations, dates, links, or supporting records where possible, and explain the outcome you are requesting."
        ]
      },
      {
        "id": "corrections-complaints-q2",
        "title": "What happens after a correction request?",
        "category": "Corrections & Complaints",
        "answer": [
          "The team may review the article and evidence, seek further information, and make a correction or update if warranted.",
          "Providing precise details helps the team review the concern efficiently. Include relevant quotations, dates, links, or supporting records where possible, and explain the outcome you are requesting."
        ]
      },
      {
        "id": "corrections-complaints-q3",
        "title": "Will every correction request be accepted?",
        "category": "Corrections & Complaints",
        "answer": [
          "No. Requests are assessed based on available evidence, context, and editorial standards.",
          "Providing precise details helps the team review the concern efficiently. Include relevant quotations, dates, links, or supporting records where possible, and explain the outcome you are requesting."
        ]
      },
      {
        "id": "corrections-complaints-q4",
        "title": "Can I complain about an article’s fairness?",
        "category": "Corrections & Complaints",
        "answer": [
          "Yes. Send the article URL, explain your concern, and include supporting evidence where possible.",
          "Providing precise details helps the team review the concern efficiently. Include relevant quotations, dates, links, or supporting records where possible, and explain the outcome you are requesting."
        ]
      },
      {
        "id": "corrections-complaints-q5",
        "title": "How do I report a misleading headline or caption?",
        "category": "Corrections & Complaints",
        "answer": [
          "Email the relevant URL and explain how the headline or caption may misrepresent the content.",
          "Providing precise details helps the team review the concern efficiently. Include relevant quotations, dates, links, or supporting records where possible, and explain the outcome you are requesting."
        ]
      },
      {
        "id": "corrections-complaints-q6",
        "title": "How long will a complaint take to resolve?",
        "category": "Corrections & Complaints",
        "answer": [
          "Review times depend on complexity and urgency. A specific response time cannot be guaranteed.",
          "Providing precise details helps the team review the concern efficiently. Include relevant quotations, dates, links, or supporting records where possible, and explain the outcome you are requesting."
        ]
      }
    ]
  },
  {
    "id": "advertising-media-kits",
    "title": "Advertising & Media Kits",
    "items": [
      {
        "id": "advertising-media-kits-q1",
        "title": "How can I enquire about advertising?",
        "category": "Advertising & Media Kits",
        "answer": [
          "Email worldnews@timeschicago.com with your organization, campaign goals, preferred dates, audience, and contact details.",
          "For a more useful response, include your organization’s name, objectives, target audience, proposed timing, and any relevant budget or scope information. Availability, pricing, and terms should be confirmed in writing before any commitment is made."
        ]
      },
      {
        "id": "advertising-media-kits-q2",
        "title": "Does Times Chicago offer a media kit?",
        "category": "Advertising & Media Kits",
        "answer": [
          "Contact the team to ask whether a current media kit, audience information, placement options, and rate card are available.",
          "For a more useful response, include your organization’s name, objectives, target audience, proposed timing, and any relevant budget or scope information. Availability, pricing, and terms should be confirmed in writing before any commitment is made."
        ]
      },
      {
        "id": "advertising-media-kits-q3",
        "title": "What advertising formats are available?",
        "category": "Advertising & Media Kits",
        "answer": [
          "Options depend on current inventory and website capabilities. Ask the advertising team about current offerings.",
          "For a more useful response, include your organization’s name, objectives, target audience, proposed timing, and any relevant budget or scope information. Availability, pricing, and terms should be confirmed in writing before any commitment is made."
        ]
      },
      {
        "id": "advertising-media-kits-q4",
        "title": "Can I request a custom advertising campaign?",
        "category": "Advertising & Media Kits",
        "answer": [
          "Describe your goals, budget range, timing, and target audience so the team can assess available options.",
          "For a more useful response, include your organization’s name, objectives, target audience, proposed timing, and any relevant budget or scope information. Availability, pricing, and terms should be confirmed in writing before any commitment is made."
        ]
      },
      {
        "id": "advertising-media-kits-q5",
        "title": "Are advertising placements guaranteed?",
        "category": "Advertising & Media Kits",
        "answer": [
          "Placement, timing, impressions, and deliverables should be confirmed in a written agreement.",
          "For a more useful response, include your organization’s name, objectives, target audience, proposed timing, and any relevant budget or scope information. Availability, pricing, and terms should be confirmed in writing before any commitment is made."
        ]
      },
      {
        "id": "advertising-media-kits-q6",
        "title": "How do I submit an advertisement for review?",
        "category": "Advertising & Media Kits",
        "answer": [
          "Ask the advertising team for specifications, file formats, deadlines, and content requirements.",
          "For a more useful response, include your organization’s name, objectives, target audience, proposed timing, and any relevant budget or scope information. Availability, pricing, and terms should be confirmed in writing before any commitment is made."
        ]
      }
    ]
  },
  {
    "id": "sponsored-content-partnerships",
    "title": "Sponsored Content & Partnerships",
    "items": [
      {
        "id": "sponsored-content-partnerships-q1",
        "title": "Does Times Chicago accept sponsored content?",
        "category": "Sponsored Content & Partnerships",
        "answer": [
          "Ask the team whether sponsored content is currently available and request the applicable terms.",
          "For a more useful response, include your organization’s name, objectives, target audience, proposed timing, and any relevant budget or scope information. Availability, pricing, and terms should be confirmed in writing before any commitment is made."
        ]
      },
      {
        "id": "sponsored-content-partnerships-q2",
        "title": "How is sponsored content identified?",
        "category": "Sponsored Content & Partnerships",
        "answer": [
          "Paid material should be clearly labelled so readers can distinguish it from independent editorial reporting.",
          "For a more useful response, include your organization’s name, objectives, target audience, proposed timing, and any relevant budget or scope information. Availability, pricing, and terms should be confirmed in writing before any commitment is made."
        ]
      },
      {
        "id": "sponsored-content-partnerships-q3",
        "title": "Can a brand submit a sponsored article?",
        "category": "Sponsored Content & Partnerships",
        "answer": [
          "Contact the team with your topic, organization details, audience, and campaign goals. Acceptance is subject to review and agreement.",
          "For a more useful response, include your organization’s name, objectives, target audience, proposed timing, and any relevant budget or scope information. Availability, pricing, and terms should be confirmed in writing before any commitment is made."
        ]
      },
      {
        "id": "sponsored-content-partnerships-q4",
        "title": "Can sponsors control independent news coverage?",
        "category": "Sponsored Content & Partnerships",
        "answer": [
          "Commercial arrangements should not promise control over independent editorial decisions or favorable news coverage.",
          "For a more useful response, include your organization’s name, objectives, target audience, proposed timing, and any relevant budget or scope information. Availability, pricing, and terms should be confirmed in writing before any commitment is made."
        ]
      },
      {
        "id": "sponsored-content-partnerships-q5",
        "title": "How can I propose a media partnership?",
        "category": "Sponsored Content & Partnerships",
        "answer": [
          "Email a brief proposal describing your organization, objectives, collaboration idea, timeline, and contact information.",
          "For a more useful response, include your organization’s name, objectives, target audience, proposed timing, and any relevant budget or scope information. Availability, pricing, and terms should be confirmed in writing before any commitment is made."
        ]
      },
      {
        "id": "sponsored-content-partnerships-q6",
        "title": "Are partnership proposals automatically accepted?",
        "category": "Sponsored Content & Partnerships",
        "answer": [
          "No. Proposals are reviewed based on relevance, feasibility, resources, and organizational standards.",
          "For a more useful response, include your organization’s name, objectives, target audience, proposed timing, and any relevant budget or scope information. Availability, pricing, and terms should be confirmed in writing before any commitment is made."
        ]
      }
    ]
  },
  {
    "id": "copyright-content-permissions",
    "title": "Copyright & Content Permissions",
    "items": [
      {
        "id": "copyright-content-permissions-q1",
        "title": "Who owns articles published by Times Chicago?",
        "category": "Copyright & Content Permissions",
        "answer": [
          "Ownership depends on the specific content, author agreements, licences, and stated rights notices.",
          "Include the relevant article title or URL and any background the editorial team needs to understand your request. Editorial decisions depend on verification, relevance, available resources, and the organization’s published standards; a submission or request does not guarantee publication or a particular change."
        ]
      },
      {
        "id": "copyright-content-permissions-q2",
        "title": "Can I republish a Times Chicago article?",
        "category": "Copyright & Content Permissions",
        "answer": [
          "Request written permission or confirm a valid licence or legal exception before reuse.",
          "Before using protected material, identify the rights holder and check any licence or permission conditions, including attribution, permitted formats, and commercial-use restrictions. If you are unsure whether your intended use is allowed, ask for written permission before publishing or distributing the material."
        ]
      },
      {
        "id": "copyright-content-permissions-q3",
        "title": "Can I use a photograph from the website?",
        "category": "Copyright & Content Permissions",
        "answer": [
          "Only if you have permission, an applicable licence, or another lawful basis. Credit alone may not authorize reuse.",
          "Before using protected material, identify the rights holder and check any licence or permission conditions, including attribution, permitted formats, and commercial-use restrictions. If you are unsure whether your intended use is allowed, ask for written permission before publishing or distributing the material."
        ]
      },
      {
        "id": "copyright-content-permissions-q4",
        "title": "How do I report copyright infringement?",
        "category": "Copyright & Content Permissions",
        "answer": [
          "Email worldnews@timeschicago.com with the work, URL, your authority, and an explanation of the concern.",
          "Before using protected material, identify the rights holder and check any licence or permission conditions, including attribution, permitted formats, and commercial-use restrictions. If you are unsure whether your intended use is allowed, ask for written permission before publishing or distributing the material."
        ]
      },
      {
        "id": "copyright-content-permissions-q5",
        "title": "Can I quote a short passage from an article?",
        "category": "Copyright & Content Permissions",
        "answer": [
          "Limited quotation may be permitted depending on purpose and context under applicable law. Attribution alone does not guarantee legality.",
          "Before using protected material, identify the rights holder and check any licence or permission conditions, including attribution, permitted formats, and commercial-use restrictions. If you are unsure whether your intended use is allowed, ask for written permission before publishing or distributing the material."
        ]
      },
      {
        "id": "copyright-content-permissions-q6",
        "title": "How can I request permission to use content?",
        "category": "Copyright & Content Permissions",
        "answer": [
          "Send the URL, identify the material, explain where and how it will be used, and include your contact details.",
          "Before using protected material, identify the rights holder and check any licence or permission conditions, including attribution, permitted formats, and commercial-use restrictions. If you are unsure whether your intended use is allowed, ask for written permission before publishing or distributing the material."
        ]
      }
    ]
  },
  {
    "id": "privacy-data-protection",
    "title": "Privacy & Data Protection",
    "items": [
      {
        "id": "privacy-data-protection-q1",
        "title": "What information may the website collect?",
        "category": "Privacy & Data Protection",
        "answer": [
          "Collection depends on actual features and configuration and may include information you submit and technical usage data. Review the Privacy Policy.",
          "If the issue persists, note the exact URL, the approximate time, and the device or browser you were using. Do not include passwords or other sensitive information in a support request."
        ]
      },
      {
        "id": "privacy-data-protection-q2",
        "title": "How can I ask about my personal information?",
        "category": "Privacy & Data Protection",
        "answer": [
          "Email worldnews@timeschicago.com and describe your request. Identity verification may be required.",
          "Please share only the information needed to explain your request and avoid sending passwords or unnecessary sensitive details by email. Any request will be considered under the website’s published policies and applicable legal requirements."
        ]
      },
      {
        "id": "privacy-data-protection-q3",
        "title": "Can I request deletion of my personal information?",
        "category": "Privacy & Data Protection",
        "answer": [
          "You may submit a request by email. Deletion depends on applicable law, retention needs, and the circumstances.",
          "Please share only the information needed to explain your request and avoid sending passwords or unnecessary sensitive details by email. Any request will be considered under the website’s published policies and applicable legal requirements."
        ]
      },
      {
        "id": "privacy-data-protection-q4",
        "title": "How is submitted information handled?",
        "category": "Privacy & Data Protection",
        "answer": [
          "The Privacy Policy should explain how information is used, stored, shared, and protected.",
          "For the most accurate assistance, consult the relevant page or policy on the website and include any useful context when contacting the team. Features and procedures may change, so this answer should be read together with the current information published by Times Chicago LLC."
        ]
      },
      {
        "id": "privacy-data-protection-q5",
        "title": "How can I report a privacy concern?",
        "category": "Privacy & Data Protection",
        "answer": [
          "Email worldnews@timeschicago.com with relevant details and avoid sending unnecessary sensitive information.",
          "Please share only the information needed to explain your request and avoid sending passwords or unnecessary sensitive details by email. Any request will be considered under the website’s published policies and applicable legal requirements."
        ]
      },
      {
        "id": "privacy-data-protection-q6",
        "title": "Where can I read the privacy terms?",
        "category": "Privacy & Data Protection",
        "answer": [
          "Use the Privacy Policy link on the website, if published.",
          "Please share only the information needed to explain your request and avoid sending passwords or unnecessary sensitive details by email. Any request will be considered under the website’s published policies and applicable legal requirements."
        ]
      }
    ]
  },
  {
    "id": "cookies-tracking-technologies",
    "title": "Cookies & Tracking Technologies",
    "items": [
      {
        "id": "cookies-tracking-technologies-q1",
        "title": "What are cookies?",
        "category": "Cookies & Tracking Technologies",
        "answer": [
          "Cookies are small files or identifiers websites may use to support functionality, remember preferences, or measure usage.",
          "Please share only the information needed to explain your request and avoid sending passwords or unnecessary sensitive details by email. Any request will be considered under the website’s published policies and applicable legal requirements."
        ]
      },
      {
        "id": "cookies-tracking-technologies-q2",
        "title": "Why might the website use cookies?",
        "category": "Cookies & Tracking Technologies",
        "answer": [
          "Depending on configuration, cookies may support essential functions, preferences, analytics, or other disclosed purposes.",
          "Please share only the information needed to explain your request and avoid sending passwords or unnecessary sensitive details by email. Any request will be considered under the website’s published policies and applicable legal requirements."
        ]
      },
      {
        "id": "cookies-tracking-technologies-q3",
        "title": "How can I manage cookie preferences?",
        "category": "Cookies & Tracking Technologies",
        "answer": [
          "Use website cookie controls if available. Browser settings can also manage cookies, though some features may be affected.",
          "Please share only the information needed to explain your request and avoid sending passwords or unnecessary sensitive details by email. Any request will be considered under the website’s published policies and applicable legal requirements."
        ]
      },
      {
        "id": "cookies-tracking-technologies-q4",
        "title": "Can I block all cookies?",
        "category": "Cookies & Tracking Technologies",
        "answer": [
          "Most browsers allow you to block or delete cookies. Blocking some cookies may affect functionality or saved preferences.",
          "Please share only the information needed to explain your request and avoid sending passwords or unnecessary sensitive details by email. Any request will be considered under the website’s published policies and applicable legal requirements."
        ]
      },
      {
        "id": "cookies-tracking-technologies-q5",
        "title": "Where can I learn which cookies are used?",
        "category": "Cookies & Tracking Technologies",
        "answer": [
          "Review the Cookie Policy or cookie-preference tool, if available.",
          "Please share only the information needed to explain your request and avoid sending passwords or unnecessary sensitive details by email. Any request will be considered under the website’s published policies and applicable legal requirements."
        ]
      },
      {
        "id": "cookies-tracking-technologies-q6",
        "title": "Why did my cookie choice appear to reset?",
        "category": "Cookies & Tracking Technologies",
        "answer": [
          "Your browser may have cleared stored data, you may be using another device, or consent settings may have changed.",
          "Please share only the information needed to explain your request and avoid sending passwords or unnecessary sensitive details by email. Any request will be considered under the website’s published policies and applicable legal requirements."
        ]
      }
    ]
  },
  {
    "id": "accessibility-support",
    "title": "Accessibility Support",
    "items": [
      {
        "id": "accessibility-support-q1",
        "title": "How do I report an accessibility problem?",
        "category": "Accessibility Support",
        "answer": [
          "Email worldnews@timeschicago.com with the page, barrier, and device or assistive technology involved, if relevant.",
          "When reporting a barrier, identify the page and describe the steps that caused the difficulty. If possible, mention your browser, device, or assistive technology so the team can better understand and assess the issue."
        ]
      },
      {
        "id": "accessibility-support-q2",
        "title": "Can I navigate the website using a keyboard?",
        "category": "Accessibility Support",
        "answer": [
          "Keyboard accessibility depends on the current implementation. Report the page and steps that caused a barrier.",
          "When reporting a barrier, identify the page and describe the steps that caused the difficulty. If possible, mention your browser, device, or assistive technology so the team can better understand and assess the issue."
        ]
      },
      {
        "id": "accessibility-support-q3",
        "title": "What if an image lacks useful alternative text?",
        "category": "Accessibility Support",
        "answer": [
          "Send the page URL and describe the image or issue so the team can review it.",
          "When reporting a barrier, identify the page and describe the steps that caused the difficulty. If possible, mention your browser, device, or assistive technology so the team can better understand and assess the issue."
        ]
      },
      {
        "id": "accessibility-support-q4",
        "title": "Are videos provided with captions or transcripts?",
        "category": "Accessibility Support",
        "answer": [
          "Availability depends on the video. Contact the team with the URL if captions or a transcript are needed or missing.",
          "When reporting a barrier, identify the page and describe the steps that caused the difficulty. If possible, mention your browser, device, or assistive technology so the team can better understand and assess the issue."
        ]
      },
      {
        "id": "accessibility-support-q5",
        "title": "Can I request information in another accessible format?",
        "category": "Accessibility Support",
        "answer": [
          "Email the content you need and the format that would help you access it. The team will review what is feasible.",
          "When reporting a barrier, identify the page and describe the steps that caused the difficulty. If possible, mention your browser, device, or assistive technology so the team can better understand and assess the issue."
        ]
      },
      {
        "id": "accessibility-support-q6",
        "title": "Where can I read the accessibility statement?",
        "category": "Accessibility Support",
        "answer": [
          "Check the website for an Accessibility Statement and instructions for reporting access barriers.",
          "When reporting a barrier, identify the page and describe the steps that caused the difficulty. If possible, mention your browser, device, or assistive technology so the team can better understand and assess the issue."
        ]
      }
    ]
  },
  {
    "id": "website-technical-support",
    "title": "Website & Technical Support",
    "items": [
      {
        "id": "website-technical-support-q1",
        "title": "What if the website will not load?",
        "category": "Website & Technical Support",
        "answer": [
          "Check your internet connection, refresh the page, and try again. If it persists, send support the URL and approximate time.",
          "If the issue persists, note the exact URL, the approximate time, and the device or browser you were using. Do not include passwords or other sensitive information in a support request."
        ]
      },
      {
        "id": "website-technical-support-q2",
        "title": "Why does a page look different on my device?",
        "category": "Website & Technical Support",
        "answer": [
          "Display can vary by screen size, browser, settings, and software. Try updating your browser or testing another one.",
          "For the most accurate assistance, consult the relevant page or policy on the website and include any useful context when contacting the team. Features and procedures may change, so this answer should be read together with the current information published by Times Chicago LLC."
        ]
      },
      {
        "id": "website-technical-support-q3",
        "title": "How do I report a broken link?",
        "category": "Website & Technical Support",
        "answer": [
          "Email the broken URL and, if possible, the page where you found it.",
          "If the issue persists, note the exact URL, the approximate time, and the device or browser you were using. Do not include passwords or other sensitive information in a support request."
        ]
      },
      {
        "id": "website-technical-support-q4",
        "title": "What if an image does not display?",
        "category": "Website & Technical Support",
        "answer": [
          "Refresh the page and check your connection. If the issue continues, send support the article URL and a description.",
          "If the issue persists, note the exact URL, the approximate time, and the device or browser you were using. Do not include passwords or other sensitive information in a support request."
        ]
      },
      {
        "id": "website-technical-support-q5",
        "title": "Why is an article loading slowly?",
        "category": "Website & Technical Support",
        "answer": [
          "Speed may be affected by your connection, device, browser, or temporary website conditions. Try again later.",
          "Include the relevant article title or URL and any background the editorial team needs to understand your request. Editorial decisions depend on verification, relevance, available resources, and the organization’s published standards; a submission or request does not guarantee publication or a particular change."
        ]
      },
      {
        "id": "website-technical-support-q6",
        "title": "What should I include in a technical support request?",
        "category": "Website & Technical Support",
        "answer": [
          "Include the URL, problem description, device and browser if known, and steps that led to the error. Never send passwords.",
          "For the most accurate assistance, consult the relevant page or policy on the website and include any useful context when contacting the team. Features and procedures may change, so this answer should be read together with the current information published by Times Chicago LLC."
        ]
      }
    ]
  },
  {
    "id": "business-media-partnerships",
    "title": "Business & Media Partnerships",
    "items": [
      {
        "id": "business-media-partnerships-q1",
        "title": "How can my organization collaborate with Times Chicago?",
        "category": "Business & Media Partnerships",
        "answer": [
          "Email worldnews@timeschicago.com with organization details, proposal, objectives, and preferred timeline.",
          "For the most accurate assistance, consult the relevant page or policy on the website and include any useful context when contacting the team. Features and procedures may change, so this answer should be read together with the current information published by Times Chicago LLC."
        ]
      },
      {
        "id": "business-media-partnerships-q2",
        "title": "Does Times Chicago consider content syndication?",
        "category": "Business & Media Partnerships",
        "answer": [
          "Contact the team to discuss availability and possible licensing, attribution, and commercial terms.",
          "For a more useful response, include your organization’s name, objectives, target audience, proposed timing, and any relevant budget or scope information. Availability, pricing, and terms should be confirmed in writing before any commitment is made."
        ]
      },
      {
        "id": "business-media-partnerships-q3",
        "title": "How can I propose a media partnership?",
        "category": "Business & Media Partnerships",
        "answer": [
          "Provide a short proposal explaining mutual benefit, audience, activities, responsibilities, and timing.",
          "For a more useful response, include your organization’s name, objectives, target audience, proposed timing, and any relevant budget or scope information. Availability, pricing, and terms should be confirmed in writing before any commitment is made."
        ]
      },
      {
        "id": "business-media-partnerships-q4",
        "title": "Can I request an interview or media comment?",
        "category": "Business & Media Partnerships",
        "answer": [
          "Send the subject, deadline, intended publication or platform, and contact information. A response is not guaranteed.",
          "For the most accurate assistance, consult the relevant page or policy on the website and include any useful context when contacting the team. Features and procedures may change, so this answer should be read together with the current information published by Times Chicago LLC."
        ]
      },
      {
        "id": "business-media-partnerships-q5",
        "title": "How can a company submit a business enquiry?",
        "category": "Business & Media Partnerships",
        "answer": [
          "Email a clear summary of your request, relevant company information, and the best way to reach you.",
          "For a more useful response, include your organization’s name, objectives, target audience, proposed timing, and any relevant budget or scope information. Availability, pricing, and terms should be confirmed in writing before any commitment is made."
        ]
      },
      {
        "id": "business-media-partnerships-q6",
        "title": "Are partnership discussions confidential?",
        "category": "Business & Media Partnerships",
        "answer": [
          "Do not assume a proposal is confidential unless confidentiality terms have been agreed. Avoid including sensitive information initially.",
          "For a more useful response, include your organization’s name, objectives, target audience, proposed timing, and any relevant budget or scope information. Availability, pricing, and terms should be confirmed in writing before any commitment is made."
        ]
      }
    ]
  },
  {
    "id": "policies-terms-legal",
    "title": "Policies, Terms & Legal",
    "items": [
      {
        "id": "policies-terms-legal-q1",
        "title": "Where can I find the Terms and Conditions?",
        "category": "Policies, Terms & Legal",
        "answer": [
          "Look for the Terms and Conditions link on the website for rules that apply to its use.",
          "Policies can be updated, so consult the current version displayed on the website rather than relying on an old saved copy. For a specific legal matter, describe the issue clearly and consider seeking advice from a qualified professional."
        ]
      },
      {
        "id": "policies-terms-legal-q2",
        "title": "Where can I read the Editorial Policy?",
        "category": "Policies, Terms & Legal",
        "answer": [
          "Use the Editorial Policy link, if published, to review the standards intended to guide editorial work.",
          "Include the relevant article title or URL and any background the editorial team needs to understand your request. Editorial decisions depend on verification, relevance, available resources, and the organization’s published standards; a submission or request does not guarantee publication or a particular change."
        ]
      },
      {
        "id": "policies-terms-legal-q3",
        "title": "Where can I find the Copyright Policy?",
        "category": "Policies, Terms & Legal",
        "answer": [
          "Check the Copyright Policy page for information about ownership, permitted use, permissions, and complaints.",
          "Before using protected material, identify the rights holder and check any licence or permission conditions, including attribution, permitted formats, and commercial-use restrictions. If you are unsure whether your intended use is allowed, ask for written permission before publishing or distributing the material."
        ]
      },
      {
        "id": "policies-terms-legal-q4",
        "title": "Where can I read the Cookie Policy?",
        "category": "Policies, Terms & Legal",
        "answer": [
          "Use the Cookie Policy link, if published, for details about cookies and related technologies.",
          "Please share only the information needed to explain your request and avoid sending passwords or unnecessary sensitive details by email. Any request will be considered under the website’s published policies and applicable legal requirements."
        ]
      },
      {
        "id": "policies-terms-legal-q5",
        "title": "Where can I find the Accessibility Statement?",
        "category": "Policies, Terms & Legal",
        "answer": [
          "Look for the Accessibility Statement for accessibility information and reporting instructions.",
          "When reporting a barrier, identify the page and describe the steps that caused the difficulty. If possible, mention your browser, device, or assistive technology so the team can better understand and assess the issue."
        ]
      },
      {
        "id": "policies-terms-legal-q6",
        "title": "Who should I contact about a legal notice?",
        "category": "Policies, Terms & Legal",
        "answer": [
          "Email worldnews@timeschicago.com with “Legal Enquiry” in the subject. Follow any applicable formal notice requirements.",
          "Policies can be updated, so consult the current version displayed on the website rather than relying on an old saved copy. For a specific legal matter, describe the issue clearly and consider seeking advice from a qualified professional."
        ]
      }
    ]
  },
  {
    "id": "contact-customer-support",
    "title": "Contact & Customer Support",
    "items": [
      {
        "id": "contact-customer-support-q1",
        "title": "What is the general contact email?",
        "category": "Contact & Customer Support",
        "answer": [
          "Contact Times Chicago LLC at worldnews@timeschicago.com.",
          "Use only the account or subscription controls actually shown on the website, and check any confirmation messages or spam folders where relevant. If the feature is unavailable or the problem continues, contact support with a short description of the issue and avoid sharing passwords."
        ]
      },
      {
        "id": "contact-customer-support-q2",
        "title": "What should I include in my email?",
        "category": "Contact & Customer Support",
        "answer": [
          "Use a descriptive subject, explain the request, include relevant URLs or reference details, and provide contact information.",
          "Use only the account or subscription controls actually shown on the website, and check any confirmation messages or spam folders where relevant. If the feature is unavailable or the problem continues, contact support with a short description of the issue and avoid sharing passwords."
        ]
      },
      {
        "id": "contact-customer-support-q3",
        "title": "How do I contact the editorial team?",
        "category": "Contact & Customer Support",
        "answer": [
          "Email worldnews@timeschicago.com with a subject such as “Editorial Enquiry,” “Correction Request,” or “Article Submission.”",
          "Include the relevant article title or URL and any background the editorial team needs to understand your request. Editorial decisions depend on verification, relevance, available resources, and the organization’s published standards; a submission or request does not guarantee publication or a particular change."
        ]
      },
      {
        "id": "contact-customer-support-q4",
        "title": "How do I contact the advertising team?",
        "category": "Contact & Customer Support",
        "answer": [
          "Email worldnews@timeschicago.com with “Advertising Enquiry” in the subject and include campaign goals and timing.",
          "For a more useful response, include your organization’s name, objectives, target audience, proposed timing, and any relevant budget or scope information. Availability, pricing, and terms should be confirmed in writing before any commitment is made."
        ]
      },
      {
        "id": "contact-customer-support-q5",
        "title": "How can I follow up on a previous request?",
        "category": "Contact & Customer Support",
        "answer": [
          "Reply to your original email thread where possible and include the date of your earlier message and relevant details.",
          "For the most accurate assistance, consult the relevant page or policy on the website and include any useful context when contacting the team. Features and procedures may change, so this answer should be read together with the current information published by Times Chicago LLC."
        ]
      },
      {
        "id": "contact-customer-support-q6",
        "title": "How quickly will I receive a response?",
        "category": "Contact & Customer Support",
        "answer": [
          "Response times vary with enquiry type and volume. A specific response time cannot be guaranteed unless expressly provided.",
          "For the most accurate assistance, consult the relevant page or policy on the website and include any useful context when contacting the team. Features and procedures may change, so this answer should be read together with the current information published by Times Chicago LLC."
        ]
      }
    ]
  }
];
