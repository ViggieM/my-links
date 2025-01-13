type TagData = {
	id: number;
	parent_id: number | null;
	name: string;
	color?: string;
	level?: number;
};

type BlobData = {
	id: number;
	uuid: string;
	title: string;
	url: string;
	notes: string;
	rating: number | null;
	blob_tags?: { tag_id: number }[];
};
