'use client';

import { InfoSection, InfoSectionSettings } from './InfoSection';
import { StorySection, StorySectionSettings } from './StorySection';

interface HomeSectionItem {
    id: string;
    type: 'info' | 'story';
    // Info fields
    smallTitle?: string;
    bigTitle?: string;
    // Story fields
    title?: string;
    // Common fields
    description: string;
    image: string;
}

interface HomeSectionsProps {
    sections: HomeSectionItem[];
}

export function HomeSections({ sections }: HomeSectionsProps) {
    if (!sections || !Array.isArray(sections)) return null;

    return (
        <div className="flex flex-col">
            {sections.map((section) => {
                if (section.type === 'info') {
                    const infoData: InfoSectionSettings = {
                        image: section.image,
                        smallTitle: section.smallTitle || '',
                        bigTitle: section.bigTitle || '',
                        description: section.description
                    };
                    return <InfoSection key={section.id} initialData={infoData} />;
                } else if (section.type === 'story') {
                    const storyData: StorySectionSettings = {
                        image: section.image,
                        title: section.title || '',
                        description: section.description
                    };
                    return <StorySection key={section.id} initialData={storyData} />;
                }
                return null;
            })}
        </div>
    );
}
