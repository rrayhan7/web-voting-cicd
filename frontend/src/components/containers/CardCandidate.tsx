"use client";

import getData from "@/hooks/getAllCandidate";
import { Button } from "../UI/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../UI/dialog";
import { useRouter } from "next/navigation";
import { CandidateProps } from "@/interface/CandidateType";

interface CandidateCardProps {
  onVote: (candidateId: string) => void;
  onDelete: (id: string) => void;
  decoded: { role: string };
}

const CardCandidate: React.FC<CandidateCardProps> = ({
  onVote,
  decoded,
  onDelete,
}) => {
  const [candidates, setCandidates] = useState<CandidateProps[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();

  const handleCardClick = (candidateId: string) => {
    router.push(`/candidate/${candidateId}`);
  };

  useEffect(() => {
    getData()
      .then((data) => setCandidates(data))
      .catch((error) => console.error("Error fetching candidates:", error));
  }, []);

  return (
    <>
      {candidates.map((candidate: CandidateProps, index: number) => (
        <div
          className="glassmorphism flex flex-col gap-2 items-center my-5 md:my-0 w-52 h-[23rem] rounded-lg transition duration-300 ease-in-out hover:scale-110"
          key={index}
          onClick={() => handleCardClick(candidate.id)}
        >
          <div className="avatar static m-2">
            <div className="w-48 h-60 rounded-lg candidate-img justify-center items-center">
              <Image
                src={`http://localhost:8000/uploads/${candidate?.image}`}
                alt=""
                width={1000}
                height={1000}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="text-dark-blue w-44 text-center font-bold">
            <span className="text-lg leading-none">{candidate?.name}</span>
          </div>
          {decoded.role === "ADMIN" ? (
            <Button
              variant="destructive"
              onClick={() => setIsDeleteModalOpen(true)}
              className="text-xl px-10 rounded "
            >
              Delete
            </Button>
          ) : (
            <Button
              onClick={() => onVote(candidate.id)}
              className="text-white text-xl px-10 bg-dark-blue rounded transition duration-300 hover:text-dark-blue hover:bg-light-blue"
            >
              Vote
            </Button>
          )}
          <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Hapus User</DialogTitle>
              </DialogHeader>
              <p>Apakah Anda yakin ingin menghapus user ini?</p>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onDelete(candidate.id);
                    setIsDeleteModalOpen(false);
                  }}
                >
                  Hapus
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ))}
    </>
  );
};

export default CardCandidate;
