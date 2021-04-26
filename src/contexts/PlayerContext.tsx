import { createContext, useState, ReactNode, useContext } from 'react';

interface Episode {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

interface PlayerContextData {
    episodeList: Array<Episode>;
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void;
    playList: (list: Array<Episode>, index: number) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    playPrevious: () => void;
    playNext: () => void;
    clearPlayerState: () => void;
    setPlayingState: (state: boolean) => void;
    hasPrevious: boolean;
    hasNext: boolean;
}

export const PlayerContext = createContext({} as PlayerContextData);

interface PlayerContextProviderProps {
    children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    const hasPrevious: boolean = currentEpisodeIndex > 0;
    const hasNext: boolean = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

    function play(episode: Episode): void {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function playList(list: Array<Episode>, index: number): void {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function togglePlay(): void {
        setIsPlaying(!isPlaying);
    }

    function toggleLoop(): void {
        setIsLooping(!isLooping);
    }

    function toggleShuffle(): void {
        setIsShuffling(!isShuffling);
    }

    function setPlayingState(state: boolean): void {
        setIsPlaying(state);
    }

    function playPrevious(): void {
        if (hasPrevious)
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }

    function playNext(): void {
        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
            setCurrentEpisodeIndex(nextRandomEpisodeIndex);
        } else if (hasNext)
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }

    function clearPlayerState(): void {
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }

    return (
        <PlayerContext.Provider value={{
            episodeList,
            currentEpisodeIndex,
            isPlaying,
            isLooping,
            isShuffling,
            play,
            playList,
            togglePlay,
            toggleLoop,
            toggleShuffle,
            setPlayingState,
            playPrevious,
            playNext,
            clearPlayerState,
            hasPrevious,
            hasNext
        }}>
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}