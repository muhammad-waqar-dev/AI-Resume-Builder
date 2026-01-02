import { initialResumeData as initialResumeData1, availableSections as availableSections1, initialSectionOrder as initialSectionOrder1 } from './Resume-1'
import { initialResumeData as initialResumeData5, availableSections as availableSections5, initialSectionOrder as initialSectionOrder5 } from './Resume-5'

export const resumesTemplates = {
    Resume1: "Resume1",
    Resume2: "Resume2",
    Resume3: "Resume3",
    Resume4: "Resume4",
    Resume5: "Resume5"
}

export const allResumeTemplates = {
    Resume1: {
        name: "Resume1", 
        description: "Resume1 Description",
        image: "/Resume-1.png",
        data: initialResumeData1, 
        sections: availableSections1,
        order: initialSectionOrder1
    },
    Resume2: {
        name: "Resume2",
        description: "Resume2 Description",
        image: "/Resume-2.png",
        data: initialResumeData1,
        sections: availableSections1,
        order: initialSectionOrder1
    },
    Resume3: {  
        name: "Resume3",
        description: "Resume3 Description",
        image: "/Resume-3.png",
        data: initialResumeData1,
        sections: availableSections1,   
        order: initialSectionOrder1
    },
    Resume4: {
        name: "Resume4",
        description: "Resume4 Description",
        image: "/Resume-4.png",
        data: initialResumeData1,
        sections: availableSections1,
        order: initialSectionOrder1
    },
    Resume5: {
        name: "Resume5",
        description: "Resume5 Description",
        image: "/Resume-5.png",
        data: initialResumeData5,
        sections: availableSections5,
        order: initialSectionOrder5
    }
}

export const getResumeData = (selectedResume) => {
    return allResumeTemplates[selectedResume]
}
